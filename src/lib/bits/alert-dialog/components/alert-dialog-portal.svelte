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
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
