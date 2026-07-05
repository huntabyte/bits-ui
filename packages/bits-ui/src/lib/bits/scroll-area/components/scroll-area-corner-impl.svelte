<script lang="ts">
	import { boxWith } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import type { ScrollAreaCornerProps } from "../types.js";
	import { ScrollAreaCornerImplState } from "../scroll-area.svelte.js";

	let {
		ref = $bindable(null),
		id,
		children,
		child,
		...restProps
	}: Omit<ScrollAreaCornerProps, "id"> & {
		id: string;
	} = $props();

	const cornerState = ScrollAreaCornerImplState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, cornerState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
