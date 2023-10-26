<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		states: { pressed }
	} = ctx.get();

	const attrs = ctx.getAttrs("input");
</script>

<input value={$pressed} hidden {...$$restProps} {...attrs} />
