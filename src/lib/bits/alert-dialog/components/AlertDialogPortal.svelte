<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { PortalProps } from "../types.js";

	type $$Props = PortalProps;
	export let asChild = false;
	const {
		elements: { portalled },
		states: { open }
	} = ctx.get();
</script>

{#if asChild}
	<slot builder={$portalled} />
{:else}
	<div use:melt={$portalled} {...$$restProps}>
		{#if $open}
			<slot builder={$portalled} />
		{/if}
	</div>
{/if}
