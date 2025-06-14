<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
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
