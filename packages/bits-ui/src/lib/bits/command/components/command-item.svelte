<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { getCommandGroupContainerContext, useCommandItem } from "../command.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = "",
		disabled = false,
		children,
		onSelect = noop,
		forceMount = false,
		keywords = [],
		...restProps
	}: ItemProps = $props();

	const group = getCommandGroupContainerContext(null);

	const itemState = useCommandItem({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => onSelect),
		forceMount: box.with(() => forceMount),
		keywords: box.with(() => keywords),
		group,
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

<div>
	{#if itemState.shouldRender}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
