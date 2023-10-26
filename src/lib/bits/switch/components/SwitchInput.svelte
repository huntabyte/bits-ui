<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		states: { checked }
	} = ctx.get();
	const attrs = ctx.getAttrs("input");
</script>

<input {...$$restProps} value={$checked} hidden {...attrs} />
