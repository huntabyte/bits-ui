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

function formatPercent(percent) {
	if (!isFinite(percent)) return "0.0";
	return Math.abs(percent).toFixed(1);
}

function formatDiff(diff, showSign = true) {
	const sign = showSign && diff > 0 ? "+" : "";
	return `${sign}${formatBytes(diff)}`;
}

function getStatusIcon(status, sizeDiff) {
	switch (status) {
		case "added":
			return "✨";
		case "removed":
			return "❌";
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

		if (!prResult && targetResult) {
			changes.push({
				component,
				status: "removed",
				sizeDiff: -targetResult.size,
				gzipSizeDiff: -targetResult.gzipSize,
				sizePercent: -100,
				gzipSizePercent: -100,
				currentSize: 0,
				currentGzipSize: 0,
				targetSize: targetResult.size,
				targetGzipSize: targetResult.gzipSize,
			});
		} else if (prResult && !targetResult) {
			changes.push({
				component,
				status: "added",
				sizeDiff: prResult.size,
				gzipSizeDiff: prResult.gzipSize,
				sizePercent: Infinity,
				gzipSizePercent: Infinity,
				currentSize: prResult.size,
				currentGzipSize: prResult.gzipSize,
				targetSize: 0,
				targetGzipSize: 0,
			});
		} else if (prResult && targetResult) {
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
			comment += "| Component | Size | Gzipped |\n";
			comment += "|-----------|------|----------|\n";

			const sortedComponents = changes.sort((a, b) => a.component.localeCompare(b.component));
			for (const comp of sortedComponents) {
				comment += `| \`${comp.component}\` | ${formatBytes(comp.currentSize)} KB | ${formatBytes(comp.currentGzipSize)} KB |\n`;
			}
			comment += "\n";
		}

		return comment;
	}

	if (changedComponents.length === 0) {
		comment += "✅ **No significant bundle size changes detected**\n\n";
		return comment;
	}

	// Summary stats
	const totalSizeDiff = changedComponents.reduce((sum, c) => sum + c.sizeDiff, 0);
	const totalGzipDiff = changedComponents.reduce((sum, c) => sum + c.gzipSizeDiff, 0);

	const summaryIcon = totalSizeDiff > 0 ? "📈" : totalSizeDiff < 0 ? "📉" : "➡️";
	comment += `### ${summaryIcon} Summary\n\n`;
	comment += `**Total bundle size change**: ${formatDiff(totalSizeDiff)} KB (${formatDiff(totalGzipDiff)} KB gzipped)\n\n`;

	// Group changes by status
	const addedComponents = changedComponents.filter((c) => c.status === "added");
	const removedComponents = changedComponents.filter((c) => c.status === "removed");
	const modifiedComponents = changedComponents.filter((c) => c.status === "changed");

	if (addedComponents.length > 0) {
		comment += "### ✨ New Components\n\n";
		comment += "| Component | Size | Gzipped |\n";
		comment += "|-----------|------|----------|\n";
		for (const comp of addedComponents) {
			comment += `| \`${comp.component}\` | +${formatBytes(comp.currentSize)} KB | +${formatBytes(comp.currentGzipSize)} KB |\n`;
		}
		comment += "\n";
	}

	if (removedComponents.length > 0) {
		comment += "### ❌ Removed Components\n\n";
		comment += "| Component | Size | Gzipped |\n";
		comment += "|-----------|------|----------|\n";
		for (const comp of removedComponents) {
			comment += `| \`${comp.component}\` | -${formatBytes(comp.targetSize)} KB | -${formatBytes(comp.targetGzipSize)} KB |\n`;
		}
		comment += "\n";
	}

	if (modifiedComponents.length > 0) {
		comment += "### 📊 Modified Components\n\n";
		comment += "| Component | Size Change | Gzipped Change | % Change |\n";
		comment += "|-----------|-------------|----------------|----------|\n";

		for (const comp of modifiedComponents) {
			const icon = getStatusIcon(comp.status, comp.sizeDiff);
			const sizeChange = `${formatDiff(comp.sizeDiff)} KB`;
			const gzipChange = `${formatDiff(comp.gzipSizeDiff)} KB`;
			const percentChange =
				comp.sizeDiff !== 0
					? `${comp.sizeDiff > 0 ? "+" : ""}${formatPercent(comp.sizePercent)}%`
					: "0.0%";

			comment += `| ${icon} \`${comp.component}\` | ${sizeChange} | ${gzipChange} | ${percentChange} |\n`;
		}
		comment += "\n";
	}

	// Add helpful context
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

		writeFileSync("./bundle-analysis-temp/comment.md", comment);

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
