<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ImageProps } from "../index.js";
	import { useAvatarImage } from "../avatar.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { src, asChild, child, el = $bindable(), ...restProps }: ImageProps = $props();

	const imageState = useAvatarImage({
		src: box.with(() => src),
	});

	const mergedProps = $derived(mergeProps(restProps, imageState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<img bind:this={el} {...mergedProps} {src} />
{/if}
