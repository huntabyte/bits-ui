export const codeBlockPrettierConfig = {
	useTabs: true,
	tabWidth: 2,
	singleQuote: false,
	trailingComma: "none",
	printWidth: 80,
	endOfLine: "lf",
	pluginSearchDirs: ["node_modules/prettier-plugin-svelte"],
	parser: "svelte",
	svelteIndexScriptAndStyle: true,
	svelteStrictMode: false,
	plugins: ["prettier-plugin-svelte"],
	overrides: [
		{
			files: "*.svelte",
			options: {
				parser: "svelte",
				svelteIndentScriptAndStyle: true,
				svelteStrictMode: false
			}
		}
	]
};
