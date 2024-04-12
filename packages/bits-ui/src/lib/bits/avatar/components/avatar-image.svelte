<script lang="ts">
	import type { ImageProps } from "../index.js";
	import { getAvatarImageState } from "../state.svelte.js";

	let { src, alt, asChild, child, el = $bindable(), ...restProps }: ImageProps = $props();

	const imageState = getAvatarImageState(src);
</script>

{#if asChild}
	{@render child?.({ src, alt, ...restProps })}
{:else}
	<img {src} bind:this={el} {alt} {...restProps} {...imageState.attrs} />
{/if}
