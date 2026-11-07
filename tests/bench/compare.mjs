// Usage: node bench/compare.mjs [baseLabel=baseline] [headLabel=current] [--all]
// Prints median deltas per scenario/metric. Rows inside the noise band are hidden unless --all.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const all = args.includes("--all");
const [base = "baseline", head = "current"] = args.filter((a) => !a.startsWith("--"));
const dir = new URL("./results/", import.meta.url).pathname;

function load(label) {
	const d = join(dir, label);
	if (!existsSync(d)) throw new Error(`no results for "${label}" in ${d}`);
	return Object.assign(
		{},
		...readdirSync(d).map((f) => JSON.parse(readFileSync(join(d, f), "utf8")))
	);
}

const A = load(base);
const B = load(head);
const rows = [];
for (const [name, metrics] of Object.entries(B)) {
	for (const [metric, b] of Object.entries(metrics)) {
		const a = A[name]?.[metric];
		if (!a) continue;
		// heap is bimodal run-to-run (V8 GC internals); its min is the stable signal
		const stat = metric === "heapKB" ? "min" : "median";
		const delta = b[stat] - a[stat];
		const pct = a[stat] ? (delta / a[stat]) * 100 : 0;
		// noise band: 10% and an absolute floor (0.5ms for timings, 100KB for heap)
		const floor = metric === "heapKB" ? 100 : 0.5;
		const significant = Math.abs(pct) >= 10 && Math.abs(delta) >= floor;
		rows.push({ name, metric, a: a[stat], b: b[stat], pct, significant });
	}
}

const fmt = (n) => (Math.abs(n) >= 100 ? n.toFixed(0) : n.toFixed(2));
const shown = rows.filter((r) => all || r.significant).sort((x, y) => x.pct - y.pct);
console.log(`${base} -> ${head}  (timing median, heap min; negative = faster/smaller)\n`);
for (const r of shown) {
	const tag = r.significant ? (r.pct < 0 ? "✅" : "❌") : "  ";
	console.log(
		`${tag} ${r.name.padEnd(36)} ${r.metric.padEnd(13)} ${fmt(r.a).padStart(9)} -> ${fmt(r.b).padStart(9)}  ${(r.pct >= 0 ? "+" : "") + r.pct.toFixed(1)}%`
	);
}
const better = rows.filter((r) => r.significant && r.pct < 0).length;
const worse = rows.filter((r) => r.significant && r.pct > 0).length;
console.log(
	`\n${better} improved, ${worse} regressed, ${rows.length - better - worse} within noise`
);
