<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		states: { checked }
	} = getCtx();
	const attrs = getAttrs("input");
</script>

<input {...$$restProps} value={$checked} hidden {...attrs} />
