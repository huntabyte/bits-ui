<script lang="ts">
	import { boxWith } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { AvatarFallbackProps } from "../types.js";
	import { AvatarFallbackState } from "../avatar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: AvatarFallbackProps = $props();

	const fallbackState = AvatarFallbackState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, fallbackState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
