<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ScrollAreaRootProps } from "../types.js";
	import { ScrollAreaRootState } from "../scroll-area.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		type = "hover",
		dir = "ltr",
		scrollHideDelay = 600,
		children,
		child,
		style,
		...restProps
	}: ScrollAreaRootProps = $props();

	const rootState = ScrollAreaRootState.create({
		type: boxWith(() => type),
		dir: boxWith(() => dir),
		scrollHideDelay: boxWith(() => scrollHideDelay),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props, { style }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
