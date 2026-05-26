<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DrawerBackdropState } from "../drawer.svelte.js";
	import type { DrawerBackdropProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		forceMount = false,
		child,
		children,
		ref = $bindable(null),
		...restProps
	}: DrawerBackdropProps = $props();

	const backdropState = DrawerBackdropState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, backdropState.props));
</script>

{#if backdropState.shouldRender || forceMount}
	{#if child}
		{@render child({ props: mergeProps(mergedProps), ...backdropState.snippetProps })}
	{:else}
		<div {...mergeProps(mergedProps)}>
			{@render children?.(backdropState.snippetProps)}
		</div>
	{/if}
{/if}
