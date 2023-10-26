<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		states: { pressed }
	} = getCtx();

	const attrs = getAttrs("input");
</script>

<input value={$pressed} hidden {...$$restProps} {...attrs} />
