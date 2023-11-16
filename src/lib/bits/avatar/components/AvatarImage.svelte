<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getImage, getAttrs } from "../ctx.js";
	import type { ImageProps } from "../types.js";

	type $$Props = ImageProps;

	export let src: $$Props["src"] = undefined;
	export let alt: $$Props["alt"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const attrs = getAttrs("image");

	$: image = getImage(src).elements.image;
	$: builder = $image;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<img use:melt={builder} {alt} {...$$restProps} {...attrs} />
{/if}
