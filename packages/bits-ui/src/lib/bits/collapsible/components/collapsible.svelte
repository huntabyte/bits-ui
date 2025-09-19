<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
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
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		disabled: boxWith(() => disabled),
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
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
