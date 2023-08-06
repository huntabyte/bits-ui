<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemProps } from "../types.js";

	type $$Props = ItemProps;
	const {
		elements: { item }
	} = ctx.get();
</script>

<div use:melt={$item} {...$$restProps}>
	<slot />
</div>
