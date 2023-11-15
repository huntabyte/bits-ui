export const codeBlockPrettierConfig = {
	useTabs: true,
	tabWidth: 2,
	singleQuote: false,
	trailingComma: "none",
	printWidth: 60,
	endOfLine: "lf",
	pluginSearchDirs: ["node_modules/prettier-plugin-svelte"],
	parser: "svelte",
	svelteIndexScriptAndStyle: true,
	svelteStrictMode: false,
	svelteSortOrder: "scripts-markup-styles-options",
	plugins: ["prettier-plugin-svelte"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
				svelteIndentScriptAndStyle: true,
				svelteStrictMode: false,
				svelteSortOrder: "scripts-markup-styles-options"
			}
		}
	],
	bracketSameLine: false
};
