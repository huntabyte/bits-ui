<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getImage, getAttrs } from "../ctx.js";
	import type { ImageProps } from "../types.js";

	type $$Props = ImageProps;

	export let src: $$Props["src"] = undefined;
	export let alt: $$Props["alt"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const attrs = getAttrs("image");

	$: image = getImage(src).elements.image;

	$: builder = $image;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<img bind:this={el} use:melt={builder} {alt} {...$$restProps} />
{/if}
