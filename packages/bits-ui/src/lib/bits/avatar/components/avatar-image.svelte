<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { AvatarImageProps } from "../types.js";
	import { AvatarImageState } from "../avatar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		src,
		child,
		id = createId(uid),
		ref = $bindable(null),
		crossorigin = undefined,
		referrerpolicy = undefined,
		...restProps
	}: AvatarImageProps = $props();

	const imageState = AvatarImageState.create({
		src: boxWith(() => src),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		crossOrigin: boxWith(() => crossorigin),
		referrerPolicy: boxWith(() => referrerpolicy),
	});

	const mergedProps = $derived(mergeProps(restProps, imageState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<img {...mergedProps} {src} />
{/if}
