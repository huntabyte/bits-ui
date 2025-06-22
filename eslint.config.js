// @ts-check
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
		languageOptions: {
			parserOptions: {
				extraFileExtensions: [".svelte"], // Add support for additional file extensions, such as .svelte
				parser: tseslint.parser,
			},
		},
	},
	{
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"prefer-const": "off",
			"svelte/no-at-html-tags": "off",
		},
	},
	{
		ignores: [
			"build/",
			".svelte-kit/",
			"dist/",
			".svelte-kit/**/*",
			"docs/.svelte-kit/**/*",
			"docs/.velite/**/*",
			"docs/src/routes/api/demos.json/stackblitz-files.json",
			"docs/src/routes/api/demos.json/demos.json",
			".svelte-kit",
			"packages/bits-ui/dist/**/*",
			"packages/bits-ui/.svelte-kit/**/*",
			"tests/.svelte-kit/**/*",
		],
	}
);
