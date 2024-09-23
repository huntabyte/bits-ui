<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import { defaultFilter, useCommandRoot } from "../command.svelte.js";
	import type { RootProps } from "../index.js";
	import CommandLabel from "./_command-label.svelte";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(""),
		onValueChange = noop,
		loop = false,
		shouldFilter = true,
		filter = defaultFilter,
		label = "",
		vimBindings = true,
		disablePointerSelection = false,
		children,
		child,
		...restProps
	}: RootProps = $props();

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
				if (v !== value) {
					value = v;
					onValueChange(v);
				}
			}
		),
		vimBindings: box.with(() => vimBindings),
		disablePointerSelection: box.with(() => disablePointerSelection),
	});

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
