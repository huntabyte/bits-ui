<script lang="ts">
	import type { ImageProps } from "../index.js";
	import { getAvatarImageState } from "../avatar.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let { src, asChild, child, el = $bindable(), style = {}, ...restProps }: ImageProps = $props();

	const imageState = getAvatarImageState({
		style: readonlyBox(() => style),
		src: readonlyBox(() => src),
	});

	const mergedProps = $derived({
		...restProps,
		...imageState.props,
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<img bind:this={el} {...mergedProps} {src} />
{/if}
