/**
 * Bits UI benchmark runner.
 *
 * Builds the bench app (production vite build, bits-ui compiled from source),
 * serves it, and drives each scenario in Chromium via Playwright with CDP CPU
 * throttling. Mirrors the Base UI benchmark methodology: open scenarios are
 * event-to-visible-paint, mount scenarios are scripted render+layout averaged
 * over 20 iterations, 5 samples each.
 *
 * Usage:
 *   node runner.mjs [--label <name>] [--scenarios a,b,c] [--skip-build]
 *                   [--compare <results/file.json>]
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { build, preview } from "vite";
import { chromium } from "playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4517;

const args = process.argv.slice(2);
function argValue(flag) {
	const i = args.indexOf(flag);
	return i === -1 ? undefined : args[i + 1];
}
const label = argValue("--label") ?? "run";
const only = argValue("--scenarios")?.split(",");
const compareFile = argValue("--compare");
const skipBuild = args.includes("--skip-build");

const ALL_SCENARIOS = [
	"dialog-open",
	"popover-open",
	"select-open",
	"menu-open",
	"combobox-open",
	"tooltip-mount",
	"select-trigger-mount",
	"menu-highlight",
];

function stats(samples) {
	const sorted = [...samples].sort((a, b) => a - b);
	const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
	const mid = Math.floor(sorted.length / 2);
	const median =
		sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
	const stddev = Math.sqrt(
		samples.reduce((acc, s) => acc + (s - mean) ** 2, 0) / samples.length
	);
	return { mean, median, min: sorted[0], max: sorted[sorted.length - 1], stddev };
}

async function runScenario(browser, name) {
	const page = await browser.newPage();
	try {
		const cdp = await page.context().newCDPSession(page);
		await page.goto(`http://localhost:${PORT}/?scenario=${name}`, {
			waitUntil: "load",
		});
		await page.waitForFunction(() => window.__ready || window.__error, null, {
			timeout: 60_000,
		});
		const setupError = await page.evaluate(() => window.__error);
		if (setupError) throw new Error(`[${name}] setup failed: ${setupError}`);

		const { cpuThrottle, samples, warmup } = await page.evaluate(() => ({
			cpuThrottle: window.__scenario.cpuThrottle,
			samples: window.__scenario.samples,
			warmup: window.__scenario.warmup,
		}));

		await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpuThrottle });
		const collected = [];
		for (let i = 0; i < warmup + samples; i++) {
			await cdp.send("HeapProfiler.collectGarbage").catch(() => {});
			const value = await page.evaluate(() => window.__scenario.run());
			if (i >= warmup) collected.push(value);
		}
		await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
		return { cpuThrottle, samples: collected, ...stats(collected) };
	} finally {
		await page.close();
	}
}

async function main() {
	if (!skipBuild) {
		console.log("building bench app...");
		await build({ root: dirname, logLevel: "warn" });
	}
	const server = await preview({
		root: dirname,
		preview: { port: PORT, strictPort: true },
	});
	const browser = await chromium.launch({ headless: true });

	const names = only ?? ALL_SCENARIOS;
	const results = {};
	try {
		for (const name of names) {
			process.stdout.write(`${name} ... `);
			try {
				results[name] = await runScenario(browser, name);
				console.log(
					`median ${results[name].median.toFixed(1)}ms (±${results[name].stddev.toFixed(1)})`
				);
			} catch (e) {
				console.log(`FAILED: ${e.message}`);
				results[name] = { error: String(e.message) };
			}
		}
	} finally {
		await browser.close();
		await new Promise((resolve) => server.httpServer.close(resolve));
	}

	const out = {
		label,
		date: new Date().toISOString(),
		results,
	};
	const resultsDir = path.join(dirname, "results");
	fs.mkdirSync(resultsDir, { recursive: true });
	const outFile = path.join(resultsDir, `${label}.json`);
	fs.writeFileSync(outFile, `${JSON.stringify(out, null, "\t")}\n`);

	let baseline;
	if (compareFile) {
		baseline = JSON.parse(fs.readFileSync(path.resolve(dirname, compareFile), "utf8"));
	}

	console.log(`\n${"scenario".padEnd(22)}${"cpu".padEnd(6)}${"median".padEnd(12)}${"mean".padEnd(12)}${"min".padEnd(12)}${baseline ? "vs baseline" : ""}`);
	for (const [name, r] of Object.entries(results)) {
		if (r.error) {
			console.log(`${name.padEnd(22)}ERROR`);
			continue;
		}
		let delta = "";
		const base = baseline?.results?.[name];
		if (base && !base.error) {
			const pct = ((r.median - base.median) / base.median) * 100;
			delta = `${pct > 0 ? "+" : ""}${pct.toFixed(1)}% (${base.median.toFixed(1)} -> ${r.median.toFixed(1)})`;
		}
		console.log(
			`${name.padEnd(22)}${`${r.cpuThrottle}x`.padEnd(6)}${`${r.median.toFixed(1)}ms`.padEnd(12)}${`${r.mean.toFixed(1)}ms`.padEnd(12)}${`${r.min.toFixed(1)}ms`.padEnd(12)}${delta}`
		);
	}
	console.log(`\nsaved to ${path.relative(process.cwd(), outFile)}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
