<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { PortalProps } from "../types.js";

	type $$Props = PortalProps;
	const {
		elements: { portalled },
		states: { open }
	} = ctx.get();
</script>

{#if $open}
	<div use:melt={$portalled} {...$$restProps}>
		<slot />
	</div>
{/if}
