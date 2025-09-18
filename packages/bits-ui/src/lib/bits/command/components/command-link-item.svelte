<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { CommandLinkItemProps } from "../types.js";
	import { CommandItemState } from "../command.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = "",
		disabled = false,
		children,
		child,
		onSelect = noop,
		forceMount = false,
		keywords = [],
		...restProps
	}: CommandLinkItemProps = $props();

	const itemState = CommandItemState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(() => value),
		disabled: boxWith(() => disabled),
		onSelect: boxWith(() => onSelect),
		forceMount: boxWith(() => forceMount),
		keywords: boxWith(() => keywords),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#key itemState.root.key}
	<div style="display: contents;">
		{#if itemState.shouldRender}
			{#if child}
				{@render child({ props: mergedProps })}
			{:else}
				<a {...mergedProps}>
					{@render children?.()}
				</a>
			{/if}
		{/if}
	</div>
{/key}
