<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CollapsibleRootProps } from "../types.js";
	import { CollapsibleRootState } from "../collapsible.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		open = $bindable(false),
		disabled = false,
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		...restProps
	}: CollapsibleRootProps = $props();

	const rootState = CollapsibleRootState.create({
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		disabled: box.with(() => disabled),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		onOpenChangeComplete: box.with(() => onOpenChangeComplete),
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
