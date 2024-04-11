import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";

const ignores = ["**/extended-types"];

export default config({ svelte: true, ignores: [...DEFAULT_IGNORES, ...ignores] })
	.override("antfu/typescript/rules", {
		rules: {
			"ts/consistent-type-definitions": "off",
		},
	})
	.override("huntabyte/svelte/rules", {
		rules: {
			"no-use-before-define": "off",
			"no-undef": "off",
		},
	});
