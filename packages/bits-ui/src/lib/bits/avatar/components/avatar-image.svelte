<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ImageProps } from "../index.js";
	import { useAvatarImage } from "../avatar.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		src,
		child,
		id = useId(),
		ref = $bindable(null),
		crossorigin = undefined,
		referrerpolicy = undefined,
		...restProps
	}: ImageProps = $props();

	const imageState = useAvatarImage({
		src: box.with(() => src),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		crossOrigin: box.with(() => crossorigin),
		referrerPolicy: box.with(() => referrerpolicy),
	});

	const mergedProps = $derived(mergeProps(restProps, imageState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<img {...mergedProps} {src} />
{/if}
