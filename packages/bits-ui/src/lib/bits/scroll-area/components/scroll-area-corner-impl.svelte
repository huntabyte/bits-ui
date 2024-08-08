<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { CornerProps } from "../index.js";
	import { useScrollAreaCorner } from "../scroll-area.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		ref = $bindable(null),
		id,
		children,
		child,
		...restProps
	}: Omit<CornerProps, "id"> & {
		id: string;
	} = $props();

	const cornerState = useScrollAreaCorner({
		id: box.with(() => id),
		ref: box.with(
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
