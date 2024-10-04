<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { CollapsibleRootProps } from "../types.js";
	import { useCollapsibleRoot } from "../collapsible.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		open = $bindable(false),
		disabled = false,
		controlledOpen = false,
		onOpenChange = noop,
		...restProps
	}: CollapsibleRootProps = $props();

	const rootState = useCollapsibleRoot({
		open: box.with(
			() => open,
			(v) => {
				if (controlledOpen) {
					onOpenChange(v);
				} else {
					open = v;
					onOpenChange(v);
				}
			}
		),
		disabled: box.with(() => disabled),
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
