<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { PortalProps } from "../types.js";

	type $$Props = PortalProps;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { portalled }
	} = getCtx();

	$: builder = $portalled;
	const attrs = getAttrs("portal");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
