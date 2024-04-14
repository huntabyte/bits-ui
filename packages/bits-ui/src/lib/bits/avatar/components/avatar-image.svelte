<script lang="ts">
	import type { ImageProps } from "../index.js";
	import { getAvatarImageState } from "../avatar.svelte.js";
	import { box } from "$lib/internal/box.svelte.js";

	let { src: srcProp, asChild, child, el = $bindable(), ...restProps }: ImageProps = $props();

	const src = box(() => srcProp);

	const imageState = getAvatarImageState(src);

	const mergedProps = {
		...imageState.props,
		...restProps,
	};
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<img bind:this={el} {...mergedProps} />
{/if}
