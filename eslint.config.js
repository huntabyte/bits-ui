import config, { DEFAULT_IGNORES } from "@huntabyte/eslint-config";

const ignores = ["./sites/docs/src/lib/content/api-reference/extended-types"];

export default config({ svelte: true, ignores: [...DEFAULT_IGNORES, ...ignores] });
