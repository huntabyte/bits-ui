<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DrawerViewportState } from "../drawer.svelte.js";
	import type { DrawerViewportProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		forceMount = false,
		child,
		children,
		ref = $bindable(null),
		...restProps
	}: DrawerViewportProps = $props();

	const viewportState = DrawerViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

{#if viewportState.shouldRender || forceMount}
	{#if child}
		{@render child({ props: mergeProps(mergedProps), ...viewportState.snippetProps })}
	{:else}
		<div {...mergeProps(mergedProps)}>
			{@render children?.(viewportState.snippetProps)}
		</div>
	{/if}
{/if}
