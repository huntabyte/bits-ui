<script lang="ts">
	import type { ImageProps } from "../index.js";
	import { useAvatarImage } from "../avatar.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { src, asChild, child, el = $bindable(), ...restProps }: ImageProps = $props();

	const state = useAvatarImage({
		src: readonlyBox(() => src),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<img bind:this={el} {...mergedProps} {src} />
{/if}
