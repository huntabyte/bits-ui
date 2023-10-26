<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ImageProps } from "../types.js";

	type $$Props = ImageProps;
	export let src: $$Props["src"] = undefined;
	export let alt: $$Props["alt"] = undefined;
	export let asChild = false;

	$: image = ctx.getImage(src).elements.image;
	$: builder = $image;
	const attrs = ctx.getAttrs("image");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<img use:melt={builder} {alt} {...$$restProps} {...attrs} />
{/if}
