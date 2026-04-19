<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DrawerIndentState } from "../drawer.svelte.js";
	import type { DrawerIndentProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: DrawerIndentProps = $props();

	const indentState = DrawerIndentState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, indentState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
