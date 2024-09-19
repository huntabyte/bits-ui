import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";

const ignores = ["**/extended-types"];

export default config({
	svelte: true,
	ignores: [...DEFAULT_IGNORES, ...ignores],
}).override("huntabyte/svelte/rules", {
	// we ignore as it complains about the changed warning names in Svelte 5
	rules: { "svelte/no-unused-svelte-ignore": "off" },
});
