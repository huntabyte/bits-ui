<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	const {
		states: { checked }
	} = ctx.get();
</script>

<input {...$$restProps} value={$checked} hidden />
