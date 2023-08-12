<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;
	const {
		elements: { input }
	} = ctx.get();
</script>

<input use:melt={$input} hidden {...$$restProps} />
