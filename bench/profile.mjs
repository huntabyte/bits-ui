/**
 * CPU-profiles a single benchmark scenario and prints the hottest functions
 * by self time. Builds unminified so function names survive.
 *
 * Usage: node profile.mjs <scenario> [--runs 3] [--skip-build] [--top 40]
 */
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { build, preview } from "vite";
import { chromium } from "playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4518;

const args = process.argv.slice(2);
const scenario = args.find((a) => !a.startsWith("--"));
if (!scenario) {
	console.error("usage: node profile.mjs <scenario>");
	process.exit(1);
}
function argValue(flag, fallback) {
	const i = args.indexOf(flag);
	return i === -1 ? fallback : args[i + 1];
}
const runs = Number(argValue("--runs", "3"));
const top = Number(argValue("--top", "40"));
const skipBuild = args.includes("--skip-build");

async function main() {
	if (!skipBuild) {
		console.log("building (unminified)...");
		await build({
			root: dirname,
			logLevel: "warn",
			build: { minify: false, sourcemap: false },
		});
	}
	const server = await preview({
		root: dirname,
		preview: { port: PORT, strictPort: true },
	});
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();
	try {
		const cdp = await page.context().newCDPSession(page);
		await page.goto(`http://localhost:${PORT}/?scenario=${scenario}`, {
			waitUntil: "load",
		});
		await page.waitForFunction(() => window.__ready || window.__error, null, {
			timeout: 60_000,
		});
		const setupError = await page.evaluate(() => window.__error);
		if (setupError) throw new Error(`setup failed: ${setupError}`);

		const cpuThrottle = await page.evaluate(() => window.__scenario.cpuThrottle);
		await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuThrottle });
		// warmup
		await page.evaluate(() => window.__scenario.run());

		await cdp.send("Profiler.enable");
		await cdp.send("Profiler.setSamplingInterval", { interval: 100 });
		await cdp.send("Profiler.start");
		const durations = [];
		for (let i = 0; i < runs; i++) {
			durations.push(await page.evaluate(() => window.__scenario.run()));
		}
		const { profile } = await cdp.send("Profiler.stop");
		await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });

		// aggregate self time per function
		const totalHits = profile.nodes.reduce((a, n) => a + (n.hitCount ?? 0), 0);
		const totalMs = (profile.endTime - profile.startTime) / 1000;
		const byFn = new Map();
		for (const node of profile.nodes) {
			const hits = node.hitCount ?? 0;
			if (!hits) continue;
			const cf = node.callFrame;
			const url = cf.url.replace(/^https?:\/\/[^/]+/, "").split("?")[0];
			const key = `${cf.functionName || "(anonymous)"} ${url}:${cf.lineNumber + 1}`;
			byFn.set(key, (byFn.get(key) ?? 0) + hits);
		}
		const rows = [...byFn.entries()]
			.map(([key, hits]) => ({ key, hits, ms: (hits / totalHits) * totalMs }))
			.sort((a, b) => b.hits - a.hits)
			.slice(0, top);

		console.log(
			`\nscenario=${scenario} cpu=${cpuThrottle}x runs=${runs} run-durations=[${durations.map((d) => d.toFixed(1)).join(", ")}]ms`
		);
		console.log(`profile wall time ${totalMs.toFixed(0)}ms, ${totalHits} samples\n`);
		console.log(`${"self-ms".padEnd(10)}${"self-%".padEnd(9)}function`);
		for (const r of rows) {
			const pct = ((r.hits / totalHits) * 100).toFixed(1);
			console.log(`${r.ms.toFixed(1).padEnd(10)}${`${pct}%`.padEnd(9)}${r.key}`);
		}
	} finally {
		await browser.close();
		await new Promise((resolve) => server.httpServer.close(resolve));
	}
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
