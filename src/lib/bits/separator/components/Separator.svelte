<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;
	export let orientation: $$Props["orientation"] = "horizontal";
	export let decorative = true;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { root },
		updateOption
	} = setCtx({ orientation, decorative });

	$: updateOption("orientation", orientation);
	$: updateOption("decorative", decorative);

	$: builder = $root;
	const attrs = getAttrs("root");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs} />
{/if}
