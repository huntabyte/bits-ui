<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ThumbProps } from "../index.js";
	import { useScrollAreaThumb } from "../scroll-area.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		ref = $bindable(null),
		id,
		child,
		children,
		...restProps
	}: Omit<ThumbProps, "forceMount" | "id"> & {
		id: string;
	} = $props();

	const thumbState = useScrollAreaThumb({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, thumbState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
