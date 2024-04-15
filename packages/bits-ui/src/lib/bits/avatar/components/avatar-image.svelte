<script lang="ts">
	import type { ImageProps } from "../index.js";
	import { getAvatarImageState } from "../avatar.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let { src: srcProp, asChild, child, el = $bindable(), ...restProps }: ImageProps = $props();

	const src = readonlyBox(() => srcProp);

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
