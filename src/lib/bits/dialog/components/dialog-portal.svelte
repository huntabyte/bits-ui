<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { PortalProps } from "../types.js";

	type $$Props = PortalProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { portalled }
	} = getCtx();

	const attrs = getAttrs("portal");

	$: builder = $portalled;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
