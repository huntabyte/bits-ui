import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";
import pluginSvelte from "eslint-plugin-svelte";
import parserSvelte from "svelte-eslint-parser";

const ignores = ["**/extended-types"];

export default config({ svelte: true, ignores: [...DEFAULT_IGNORES, ...ignores] }).override(
	"antfu/typescript/rules",
	{
		rules: {
			"ts/consistent-type-definitions": "off",
		},
	}
);
