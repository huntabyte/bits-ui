<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCommandRoot } from "../command.svelte.js";
	import type { CommandRootProps } from "../types.js";
	import CommandLabel from "./_command-label.svelte";
	import { noop } from "$lib/internal/noop.js";
	import { useId } from "$lib/internal/use-id.js";
	import { computeCommandScore } from "../index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = noop,
		onStateChange = noop,
		loop = false,
		shouldFilter = true,
		filter = computeCommandScore,
		label = "",
		vimBindings = true,
		disablePointerSelection = false,
		children,
		child,
		...restProps
	}: CommandRootProps = $props();

	const rootState = useCommandRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		filter: box.with(() => filter),
		shouldFilter: box.with(() => shouldFilter),
		loop: box.with(() => loop),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		vimBindings: box.with(() => vimBindings),
		disablePointerSelection: box.with(() => disablePointerSelection),
		onStateChange: box.with(() => onStateChange),
	});

	export const updateSelectedToIndex: (typeof rootState)["updateSelectedToIndex"] = (i) =>
		rootState.updateSelectedToIndex(i);
	export const updateSelectedByGroup: (typeof rootState)["updateSelectedByGroup"] = (c) =>
		rootState.updateSelectedByGroup(c);
	export const updateSelectedByItem: (typeof rootState)["updateSelectedByItem"] = (c) =>
		rootState.updateSelectedByItem(c);
	export const getNumValidItems = () => rootState.numValidItems;

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#snippet Label()}
	<CommandLabel>
		{label}
	</CommandLabel>
{/snippet}

{#if child}
	{@render Label()}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render Label()}
		{@render children?.()}
	</div>
{/if}
