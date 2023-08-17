<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		states: { pressed }
	} = ctx.get();
</script>

<input {...$$restProps} value={$pressed} hidden />
