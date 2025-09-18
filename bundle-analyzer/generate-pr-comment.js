import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * @typedef {Object} BundleResult
 * @property {string} component
 * @property {number} size
 * @property {number} gzipSize
 * @property {string[]} exports
 */

/**
 * @typedef {Object} BundleReport
 * @property {string} timestamp
 * @property {BundleResult[]} results
 */

/**
 * @typedef {Object} ComponentDiff
 * @property {string} component
 * @property {'added'|'removed'|'changed'|'unchanged'} status
 * @property {number} sizeDiff
 * @property {number} gzipSizeDiff
 * @property {number} sizePercent
 * @property {number} gzipSizePercent
 * @property {number} currentSize
 * @property {number} currentGzipSize
 * @property {number} targetSize
 * @property {number} targetGzipSize
 */

function formatBytes(bytes) {
	return (bytes / 1024).toFixed(2);
}

function formatDiff(diff, showSign = true) {
	const sign = showSign && diff > 0 ? "+" : "";
	return `${sign}${formatBytes(diff)}`;
}

function getStatusIcon(status, sizeDiff) {
	switch (status) {
		case "changed":
			return sizeDiff > 0 ? "📈" : sizeDiff < 0 ? "📉" : "➡️";
		case "unchanged":
			return "➡️";
		default:
			return "❓";
	}
}

function analyzeBundleChanges(prReport, targetReport) {
	/** @type {ComponentDiff[]} */
	const changes = [];

	const prMap = new Map(prReport.results.map((r) => [r.component, r]));
	const targetMap = new Map(targetReport.results.map((r) => [r.component, r]));

	const allComponents = new Set([...prMap.keys(), ...targetMap.keys()]);

	for (const component of allComponents) {
		const prResult = prMap.get(component);
		const targetResult = targetMap.get(component);

		if (prResult && targetResult) {
			const sizeDiff = prResult.size - targetResult.size;
			const gzipSizeDiff = prResult.gzipSize - targetResult.gzipSize;
			const sizePercent = targetResult.size > 0 ? (sizeDiff / targetResult.size) * 100 : 0;
			const gzipSizePercent =
				targetResult.gzipSize > 0 ? (gzipSizeDiff / targetResult.gzipSize) * 100 : 0;

			const hasSignificantChange = Math.abs(sizeDiff) > 10 || Math.abs(sizePercent) > 0.1;

			changes.push({
				component,
				status: hasSignificantChange ? "changed" : "unchanged",
				sizeDiff,
				gzipSizeDiff,
				sizePercent,
				gzipSizePercent,
				currentSize: prResult.size,
				currentGzipSize: prResult.gzipSize,
				targetSize: targetResult.size,
				targetGzipSize: targetResult.gzipSize,
			});
		}
	}

	return changes.sort((a, b) => a.component.localeCompare(b.component));
}

function generateComment(changes, hasBaseline = true) {
	const changedComponents = changes.filter((c) => c.status !== "unchanged");

	let comment = "## 📦 Bundle Size Analysis\n\n";

	if (!hasBaseline) {
		comment += "🆕 **Initial bundle size report** - No baseline to compare against\n\n";
		comment += "This appears to be the first bundle analysis for this branch. ";
		comment += "Future PRs will show size comparisons against these baseline measurements.\n\n";

		if (changes.length > 0) {
			comment += "### 📊 Current Component Sizes\n\n";
			comment += "| Component | Size |\n";
			comment += "|-----------|------|\n";

			const sortedComponents = changes.sort((a, b) => a.component.localeCompare(b.component));
			for (const comp of sortedComponents) {
				comment += `| \`${comp.component}\` | ${formatBytes(comp.currentSize)} KB <sub>(${formatBytes(comp.currentGzipSize)} KB)</sub> |\n`;
			}
			comment += "\n";
		}

		return comment;
	}

	if (changedComponents.length === 0) {
		comment += "✅ **No significant bundle size changes detected**\n\n";
		return comment;
	}

	const modifiedComponents = changedComponents.filter((c) => c.status === "changed");

	if (modifiedComponents.length > 0) {
		comment += "### 📊 Modified Components\n\n";
		comment += "| Component | Current | New | Change |\n";
		comment += "|-----------|---------|-----|--------|\n";

		for (const comp of modifiedComponents) {
			const icon = getStatusIcon(comp.status, comp.sizeDiff);
			const currentSize = `${formatBytes(comp.targetSize)} KB <sub>(${formatBytes(comp.targetGzipSize)} KB)</sub>`;
			const newSize = `${formatBytes(comp.currentSize)} KB <sub>(${formatBytes(comp.currentGzipSize)} KB)</sub>`;
			const sizeChange = `${formatDiff(comp.sizeDiff)} KB <sub>(${formatDiff(comp.gzipSizeDiff)} KB)</sub>`;
			comment += `| ${icon} \`${comp.component}\` | ${currentSize} | ${newSize} | ${sizeChange} |\n`;
		}
		comment += "\n";
	}

	comment += "---\n\n";
	comment += "<details>\n";
	comment += "<summary>📋 Understanding Bundle Analysis</summary>\n\n";
	comment +=
		"- **Individual Import Cost**: Each component is measured in isolation, including all its dependencies\n";
	comment +=
		"- **Real-world Usage**: When multiple components are used together, shared dependencies are deduplicated thus the actual bundle size is smaller than the sum of the individual component sizes\n";
	comment +=
		"- **Thresholds**: Changes smaller than 0.01 KB or 0.1% are considered insignificant\n";
	comment += "- **Gzipped Size**: Represents the compressed size served to users\n\n";
	comment += "</details>\n";

	return comment;
}

function main() {
	const args = process.argv.slice(2);

	if (args.length !== 2) {
		console.error("Usage: node generate-pr-comment.js <pr-report.json> <target-report.json>");
		process.exit(1);
	}

	const [prReportPath, targetReportPath] = args;

	try {
		/** @type {BundleReport} */
		const prReport = JSON.parse(readFileSync(resolve(prReportPath), "utf-8"));
		/** @type {BundleReport} */
		const targetReport = JSON.parse(readFileSync(resolve(targetReportPath), "utf-8"));

		const hasBaseline = targetReport.results && targetReport.results.length > 0;

		let changes;
		if (hasBaseline) {
			changes = analyzeBundleChanges(prReport, targetReport);
		} else {
			changes = prReport.results.map((result) => ({
				component: result.component,
				status: "added",
				sizeDiff: result.size,
				gzipSizeDiff: result.gzipSize,
				sizePercent: Infinity,
				gzipSizePercent: Infinity,
				currentSize: result.size,
				currentGzipSize: result.gzipSize,
				targetSize: 0,
				targetGzipSize: 0,
			}));
		}

		const comment = generateComment(changes, hasBaseline);

		writeFileSync("/tmp/bundle-analysis/comment.md", comment);

		console.log("✅ Bundle analysis comment generated successfully");
		if (hasBaseline) {
			console.log(
				`📊 Found ${changes.filter((c) => c.status !== "unchanged").length} component changes`
			);
		} else {
			console.log("🆕 No baseline found - generated initial report");
		}
	} catch (error) {
		console.error("❌ Failed to generate bundle analysis comment:", error.message);
		process.exit(1);
	}
}

main();
