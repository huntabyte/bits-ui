<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SeparatorProps } from "../types.js";

	type $$Props = SeparatorProps;
	const {
		elements: { separator }
	} = ctx.getMenu();
</script>

<div use:melt={$separator} {...$$restProps} />
