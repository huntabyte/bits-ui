<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ImageProps } from "../types.js";

	type $$Props = ImageProps;
	export let src: $$Props["src"] = undefined;
	export let alt: $$Props["alt"] = undefined;
	export let asChild = false;

	$: image = ctx.getImage(src).elements.image;
</script>

{#if asChild}
	<slot builder={$image} />
{:else}
	<img use:melt={$image} {alt} {...$$restProps} />
{/if}
