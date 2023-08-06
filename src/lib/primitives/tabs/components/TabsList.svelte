<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ListProps } from "../types.js";
	type $$Props = ListProps;

	const {
		elements: { list }
	} = ctx.get();
</script>

<div use:melt={$list} {...$$restProps}>
	<slot />
</div>
