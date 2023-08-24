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

{#if $open}
	{@const builder = $portalled}
	{#if asChild}
		<slot {builder} />
	{:else}
		<div use:melt={builder} {...$$restProps}>
			<slot {builder} />
		</div>
	{/if}
{/if}
