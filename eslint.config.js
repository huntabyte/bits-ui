import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";

const ignores = ["**/extended-types"];

export default config({ svelte: true, ignores: [...DEFAULT_IGNORES, ...ignores] })
	.override("antfu/typescript/rules", {
		rules: {
			"ts/consistent-type-definitions": "off",
			"ts/ban-types": [
				"error",
				{
					types: {
						"{}": false,
					},
				},
			],
		},
	})
	.override("antfu/javascript/rules", {
		rules: {
			"no-unused-expressions": "off",
		},
	})
	.override("huntabyte/svelte/rules", {
		rules: {
			"svelte/no-at-html-tags": "off",
		},
	});
