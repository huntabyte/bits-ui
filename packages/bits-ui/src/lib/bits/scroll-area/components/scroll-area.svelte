<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
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
		...restProps
	}: ScrollAreaRootProps = $props();

	const rootState = ScrollAreaRootState.create({
		type: box.with(() => type),
		dir: box.with(() => dir),
		scrollHideDelay: box.with(() => scrollHideDelay),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
