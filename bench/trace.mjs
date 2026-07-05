/**
 * Captures a Chrome trace (devtools.timeline) for one benchmark scenario run
 * and prints a breakdown of main-thread time by event type (script, style
 * recalc, layout, paint, GC), plus the heaviest style/layout events with node
 * counts. Use this when the sampling profiler attributes time to "(program)".
 *
 * Usage: node trace.mjs <scenario> [--skip-build]
 */
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { build, preview } from "vite";
import { chromium } from "playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4519;

const args = process.argv.slice(2);
const scenario = args.find((a) => !a.startsWith("--"));
if (!scenario) {
	console.error("usage: node trace.mjs <scenario>");
	process.exit(1);
}
const skipBuild = args.includes("--skip-build");

async function main() {
	if (!skipBuild) {
		console.log("building...");
		await build({ root: dirname, logLevel: "warn" });
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
		const cpuThrottle = await page.evaluate(() => window.__scenario.cpuThrottle);
		await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuThrottle });
		await page.evaluate(() => window.__scenario.run()); // warmup

		const events = [];
		cdp.on("Tracing.dataCollected", (payload) => events.push(...payload.value));
		const tracingDone = new Promise((resolve) =>
			cdp.once("Tracing.tracingComplete", resolve)
		);
		await cdp.send("Tracing.start", {
			traceConfig: {
				includedCategories: [
					"devtools.timeline",
					"disabled-by-default-devtools.timeline",
					"blink.user_timing",
					"v8.execute",
				],
			},
			transferMode: "ReportEvents",
		});
		const duration = await page.evaluate(() => window.__scenario.run());
		await cdp.send("Tracing.end");
		await tracingDone;
		await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });

		// aggregate complete events (ph: X) by name on the renderer main thread
		const byName = new Map();
		const interesting = [];
		for (const e of events) {
			if (e.ph !== "X" || typeof e.dur !== "number") continue;
			const entry = byName.get(e.name) ?? { totalMs: 0, count: 0 };
			entry.totalMs += e.dur / 1000;
			entry.count++;
			byName.set(e.name, entry);
			if (
				(e.name === "UpdateLayoutTree" || e.name === "Layout" || e.name === "Paint" || e.name === "PrePaint") &&
				e.dur > 2000
			) {
				interesting.push(e);
			}
		}
		const rows = [...byName.entries()]
			.map(([name, { totalMs, count }]) => ({ name, totalMs, count }))
			.sort((a, b) => b.totalMs - a.totalMs)
			.slice(0, 25);

		console.log(`\nscenario=${scenario} cpu=${cpuThrottle}x traced-run=${duration.toFixed(1)}ms\n`);
		console.log(`${"total-ms".padEnd(11)}${"count".padEnd(8)}event`);
		for (const r of rows) {
			console.log(`${r.totalMs.toFixed(1).padEnd(11)}${String(r.count).padEnd(8)}${r.name}`);
		}
		console.log("\nheaviest style/layout events:");
		for (const e of interesting.sort((a, b) => b.dur - a.dur).slice(0, 10)) {
			const d = e.args?.beginData ?? e.args?.data ?? {};
			console.log(
				`  ${e.name} ${(e.dur / 1000).toFixed(1)}ms ${JSON.stringify({ dirtyObjects: d.dirtyObjects, totalObjects: d.totalObjects, nodes: d.nodeCount ?? d.totalObjects, frame: undefined })}`
			);
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
