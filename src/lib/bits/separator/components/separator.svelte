<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let orientation: $$Props["orientation"] = "horizontal";
	export let decorative: $$Props["decorative"] = true;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { root },
		updateOption
	} = setCtx({ orientation, decorative });

	const attrs = getAttrs("root");

	$: updateOption("orientation", orientation);
	$: updateOption("decorative", decorative);

	$: builder = $root;
	$: slotProps = { builder, attrs };
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs} />
{/if}
