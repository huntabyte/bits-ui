<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { PortalProps } from "../types.js";

	type $$Props = PortalProps;
	export let asChild = false;
	const portal = getCtx().elements.portalled;

	$: builder = $portal;
	const attrs = getAttrs("portal");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
