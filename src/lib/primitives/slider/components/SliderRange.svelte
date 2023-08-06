<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { RangeProps } from "../types.js";

	type $$Props = RangeProps;
	const {
		elements: { range }
	} = ctx.get();
</script>

<span use:melt={$range} {...$$restProps} />
