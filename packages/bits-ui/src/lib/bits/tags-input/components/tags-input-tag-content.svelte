<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TagContentProps } from "../index.js";
	import { useTagsInputTagContent } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: TagContentProps = $props();

	const tagContentState = useTagsInputTagContent({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, tagContentState.props));
	const mergedWrapperProps = $derived(mergeProps(tagContentState.wrapperProps, {}));
</script>

<div {...mergedWrapperProps}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
