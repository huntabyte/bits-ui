import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";

const ignores = ["**/extended-types"];

export default config({ svelte: true, ignores: [...DEFAULT_IGNORES, ...ignores] });
