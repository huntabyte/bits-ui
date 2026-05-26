<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		ratio: boxWith(() => ratio),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		<div style:position="absolute" style:inset="0">
			{@render children?.()}
		</div>
	</div>
{/if}
