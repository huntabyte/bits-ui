<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { AspectRatioRootProps } from "../types.js";
	import { AspectRatioRootState } from "../aspect-ratio.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		ratio = 1,
		children,
		child,
		...restProps
	}: AspectRatioRootProps = $props();

	const rootState = AspectRatioRootState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		ratio: box.with(() => ratio),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

<div style:position="relative" style:width="100%" style:padding-bottom="{ratio ? 100 / ratio : 0}%">
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
