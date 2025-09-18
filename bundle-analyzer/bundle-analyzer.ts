#!/usr/bin/env node

import { build } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve, join } from "node:path";
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { gzipSync } from "node:zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ComponentInfo {
	name: string;
	exports: string[];
}

interface BundleResult {
	component: string;
	size: number;
	gzipSize: number;
	exports: string[];
}

interface BundleReport {
	timestamp: string;
	results: BundleResult[];
	total: {
		size: number;
		gzipSize: number;
	};
}

// component definitions - extracted from the actual exports
const COMPONENTS: ComponentInfo[] = [
	{
		name: "Select",
		exports: [
			"Root",
			"Content",
			"Item",
			"Group",
			"GroupHeading",
			"Trigger",
			"Viewport",
			"ScrollUpButton",
			"ScrollDownButton",
			"Portal",
		],
	},
	{
		name: "Dialog",
		exports: [
			"Root",
			"Content",
			"Trigger",
			"Portal",
			"Overlay",
			"Close",
			"Title",
			"Description",
		],
	},
	{
		name: "Popover",
		exports: ["Root", "Content", "Trigger", "Portal", "Close", "Arrow"],
	},
	{
		name: "Accordion",
		exports: ["Root", "Item", "Header", "Trigger", "Content"],
	},
	{
		name: "Tabs",
		exports: ["Root", "List", "Trigger", "Content"],
	},
	{
		name: "DropdownMenu",
		exports: [
			"Root",
			"Content",
			"Item",
			"Group",
			"GroupHeading",
			"Trigger",
			"Portal",
			"CheckboxItem",
			"RadioGroup",
			"RadioItem",
			"Separator",
			"Arrow",
			"Sub",
			"SubContent",
			"SubTrigger",
		],
	},
	{
		name: "ContextMenu",
		exports: [
			"Root",
			"Content",
			"Item",
			"Group",
			"GroupHeading",
			"Trigger",
			"Portal",
			"CheckboxItem",
			"RadioGroup",
			"RadioItem",
			"Separator",
			"Arrow",
			"Sub",
			"SubContent",
			"SubTrigger",
		],
	},
	{
		name: "AlertDialog",
		exports: [
			"Root",
			"Content",
			"Trigger",
			"Portal",
			"Overlay",
			"Cancel",
			"Action",
			"Title",
			"Description",
		],
	},
	{
		name: "Tooltip",
		exports: ["Root", "Content", "Trigger", "Portal", "Arrow"],
	},
	{
		name: "Checkbox",
		exports: ["Root", "Input", "Indicator"],
	},
];

class BundleAnalyzer {
	private tempDir: string;
	private outputDir: string;

	constructor() {
		this.tempDir = resolve(__dirname, ".temp-bundle-analysis");
		this.outputDir = resolve(__dirname, "../bundle-reports");
	}

	async analyze(components?: string[]): Promise<BundleReport> {
		console.log("🔍 Starting bundle analysis...");

		const componentsToAnalyze = components
			? COMPONENTS.filter((c) => components.includes(c.name))
			: COMPONENTS;

		this.setupTempDirectory();

		const results: BundleResult[] = [];

		for (const component of componentsToAnalyze) {
			console.log(`📦 Analyzing ${component.name}...`);
			const result = await this.analyzeComponent(component);
			results.push(result);
		}

		const total = results.reduce(
			(acc, result) => ({
				size: acc.size + result.size,
				gzipSize: acc.gzipSize + result.gzipSize,
			}),
			{ size: 0, gzipSize: 0 }
		);

		const report: BundleReport = {
			timestamp: new Date().toISOString(),
			results,
			total,
		};

		// save report
		this.saveReport(report);
		this.printReport(report);

		return report;
	}

	private setupTempDirectory() {
		if (existsSync(this.tempDir)) {
			rmSync(this.tempDir, { recursive: true });
		}
		mkdirSync(this.tempDir, { recursive: true });

		if (!existsSync(this.outputDir)) {
			mkdirSync(this.outputDir, { recursive: true });
		}
	}

	private async analyzeComponent(component: ComponentInfo): Promise<BundleResult> {
		// create test component file
		const testComponentPath = this.createTestComponent(component);

		// build with vite
		const buildResult = await this.buildComponent(testComponentPath, component.name);

		return {
			component: component.name,
			size: buildResult.size,
			gzipSize: buildResult.gzipSize,
			exports: component.exports,
		};
	}

	private createTestComponent(component: ComponentInfo): string {
		// Import the component namespace
		const namespaceImport = `import { ${component.name} } from "bits-ui";`;

		// Create references to all exports to prevent tree-shaking
		const exportReferences = component.exports
			.map((exp) => `${component.name}.${exp}`)
			.join(",\n\t");

		const componentContent = `${namespaceImport}

// test component that uses all exports to ensure they're included in bundle
export function Test${component.name}Component() {
	// reference all exports to prevent tree-shaking
	const refs = [
		${exportReferences}
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	${exportReferences}
	];
`;

		const filePath = join(this.tempDir, `${component.name}.test.ts`);
		writeFileSync(filePath, componentContent);
		return filePath;
	}

	private async buildComponent(
		entryPath: string,
		componentName: string
	): Promise<{ size: number; gzipSize: number }> {
		const outputPath = join(this.tempDir, `dist-${componentName}`);
		const statsPath = join(outputPath, "stats.json");

		try {
			await build({
				plugins: [
					svelte(),
					visualizer({
						filename: statsPath,
						template: "raw-data",
						gzipSize: true,
					}),
				],
				build: {
					lib: {
						entry: entryPath,
						formats: ["es"],
						fileName: "bundle",
					},
					outDir: outputPath,
					write: true,
					minify: "terser",
					rollupOptions: {
						external: [
							"svelte",
							"svelte/internal",
							"svelte/store",
							"svelte/animate",
							"svelte/easing",
							"svelte/motion",
							"svelte/transition",
							"svelte/compiler",
						],
						output: {
							manualChunks: undefined,
						},
					},
				},
			});

			// analyze bundle composition using visualizer data
			const { size, gzipSize } = this.analyzeBundleComposition(statsPath, componentName);

			return { size, gzipSize };
		} catch (error) {
			console.error(`Failed to build ${componentName}:`, error);
			return { size: 0, gzipSize: 0 };
		}
	}

	private analyzeBundleComposition(
		statsPath: string,
		componentName: string
	): { size: number; gzipSize: number } {
		if (!existsSync(statsPath)) {
			console.warn(`Stats file not found for ${componentName}, falling back to bundle file`);
			return this.fallbackBundleSize(componentName);
		}

		try {
			const stats = JSON.parse(readFileSync(statsPath, "utf-8"));

			// Extract all modules from the tree structure
			const allModules = this.extractModulesFromTree(stats.tree || stats);

			// Add size information from nodeParts
			const enrichedModules = this.enrichModulesWithSizes(allModules, stats.nodeParts || {});

			// Filter to keep only the specific component code
			const componentModules = this.filterComponentModules(enrichedModules, componentName);

			let totalSize = 0;
			let totalGzipSize = 0;

			for (const module of componentModules) {
				totalSize += module.renderedLength || 0;
				totalGzipSize += module.gzipLength || 0;
			}

			console.log(
				`📊 ${componentName} - Component code: ${totalSize} bytes (${totalGzipSize} gzipped)`
			);
			console.log(
				`   Filtered out ${enrichedModules.length - componentModules.length} Svelte runtime modules`
			);

			return { size: totalSize, gzipSize: totalGzipSize };
		} catch (error) {
			console.error(`Failed to analyze bundle composition for ${componentName}:`, error);
			return this.fallbackBundleSize(componentName);
		}
	}

	private extractModulesFromTree(node: any): any[] {
		const modules: any[] = [];

		const traverse = (n: any, path: string = "") => {
			const currentPath = path ? `${path}/${n.name}` : n.name;

			// If node has uid, it's a leaf module
			if (n.uid) {
				modules.push({
					...n,
					path: currentPath,
					id: currentPath,
				});
			}

			// Recursively traverse children
			if (n.children && Array.isArray(n.children)) {
				for (const child of n.children) {
					traverse(child, currentPath);
				}
			}
		};

		traverse(node);
		return modules;
	}

	private enrichModulesWithSizes(modules: any[], nodeParts: any): any[] {
		return modules.map((module) => {
			const sizeInfo = nodeParts[module.uid] || {};
			return {
				...module,
				renderedLength: sizeInfo.renderedLength || 0,
				gzipLength: sizeInfo.gzipLength || 0,
				brotliLength: sizeInfo.brotliLength || 0,
			};
		});
	}

	private filterComponentModules(modules: any[], componentName: string): any[] {
		// Keep ONLY modules from packages/bits-ui/dist (component + shared internals)
		return modules.filter((module: any) => {
			const path = module.path || module.id || "";
			const name = module.name || "";

			// Only include modules from bits-ui dist directory
			const isBitsUIDistModule =
				path.includes("packages/bits-ui/dist") ||
				path.includes("bits-ui/dist") ||
				(name.includes("bits-ui") && path.includes("dist"));

			return isBitsUIDistModule;
		});
	}

	private fallbackBundleSize(componentName: string): { size: number; gzipSize: number } {
		const outputPath = join(this.tempDir, `dist-${componentName}`);
		const bundlePath = join(outputPath, "bundle.js");

		if (!existsSync(bundlePath)) {
			return { size: 0, gzipSize: 0 };
		}

		const bundleContent = readFileSync(bundlePath, "utf-8");
		const size = Buffer.byteLength(bundleContent, "utf-8");
		const gzipBuffer = gzipSync(bundleContent);
		const gzipSize = gzipBuffer.length;

		return { size, gzipSize };
	}

	private saveReport(report: BundleReport) {
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const filename = `bundle-report-${timestamp}.json`;
		const filepath = join(this.outputDir, filename);

		writeFileSync(filepath, JSON.stringify(report, null, 2));

		// also save as latest
		const latestPath = join(this.outputDir, "latest.json");
		writeFileSync(latestPath, JSON.stringify(report, null, 2));

		console.log(`📊 Report saved to ${filepath}`);
	}

	private printReport(report: BundleReport) {
		console.log("\n📊 Bundle Size Report");
		console.log("=====================");
		console.log(`Generated: ${new Date(report.timestamp).toLocaleString()}\n`);

		// sort by size desc
		const sortedResults = [...report.results].sort((a, b) => b.size - a.size);

		console.log("Component Sizes:");
		console.log("----------------");
		for (const result of sortedResults) {
			const sizeKB = (result.size / 1024).toFixed(2);
			const gzipKB = (result.gzipSize / 1024).toFixed(2);
			console.log(
				`${result.component.padEnd(15)} ${sizeKB.padStart(8)} KB (${gzipKB} KB gzipped)`
			);
		}

		console.log("\nTotal Bundle Size:");
		console.log("------------------");
		console.log(`Raw:     ${(report.total.size / 1024).toFixed(2)} KB`);
		console.log(`Gzipped: ${(report.total.gzipSize / 1024).toFixed(2)} KB`);
	}

	private cleanup() {
		if (existsSync(this.tempDir)) {
			rmSync(this.tempDir, { recursive: true });
		}
	}

	// compare two reports
	static compare(currentPath: string, previousPath: string): void {
		const current: BundleReport = JSON.parse(readFileSync(currentPath, "utf-8"));
		const previous: BundleReport = JSON.parse(readFileSync(previousPath, "utf-8"));

		console.log("\n📈 Bundle Size Comparison");
		console.log("=========================");

		const currentMap = new Map(current.results.map((r) => [r.component, r]));
		const previousMap = new Map(previous.results.map((r) => [r.component, r]));

		const allComponents = new Set([...currentMap.keys(), ...previousMap.keys()]);

		for (const component of Array.from(allComponents).sort()) {
			const curr = currentMap.get(component);
			const prev = previousMap.get(component);

			if (!curr) {
				console.log(`❌ ${component}: REMOVED`);
				continue;
			}

			if (!prev) {
				console.log(`✨ ${component}: NEW (+${(curr.size / 1024).toFixed(2)} KB)`);
				continue;
			}

			const sizeDiff = curr.size - prev.size;
			const percentChange = ((sizeDiff / prev.size) * 100).toFixed(1);
			const diffKB = (sizeDiff / 1024).toFixed(2);

			const icon = sizeDiff > 0 ? "📈" : sizeDiff < 0 ? "📉" : "➡️";
			const sign = sizeDiff > 0 ? "+" : "";

			console.log(`${icon} ${component}: ${sign}${diffKB} KB (${sign}${percentChange}%)`);
		}

		const totalDiff = current.total.size - previous.total.size;
		const totalPercentChange = ((totalDiff / previous.total.size) * 100).toFixed(1);
		const totalDiffKB = (totalDiff / 1024).toFixed(2);

		console.log("\nTotal Change:");
		console.log("-------------");
		const totalIcon = totalDiff > 0 ? "📈" : totalDiff < 0 ? "📉" : "➡️";
		const totalSign = totalDiff > 0 ? "+" : "";
		console.log(
			`${totalIcon} ${totalSign}${totalDiffKB} KB (${totalSign}${totalPercentChange}%)`
		);
	}
}

// CLI interface
async function main() {
	const args = process.argv.slice(2);
	const analyzer = new BundleAnalyzer();

	if (args.includes("--compare")) {
		const currentIndex = args.indexOf("--compare") + 1;
		const previousIndex = args.indexOf("--compare") + 2;

		if (args[currentIndex] && args[previousIndex]) {
			BundleAnalyzer.compare(args[currentIndex], args[previousIndex]);
		} else {
			console.error("Usage: --compare <current-report.json> <previous-report.json>");
			process.exit(1);
		}
		return;
	}

	// filter components if specified
	const componentArgs = args.filter((arg) => !arg.startsWith("--"));
	const components = componentArgs.length > 0 ? componentArgs : undefined;

	await analyzer.analyze(components);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(console.error);
}

export { BundleAnalyzer, type BundleReport, type BundleResult };
