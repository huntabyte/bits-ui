<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useTagsInputRoot } from "../tags-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		value = $bindable([]),
		ref = $bindable(null),
		onValueChange = noop,
		controlledValue = false,
		delimiter = ",",
		children,
		child,
		...restProps
	}: RootProps = $props();

	const rootState = useTagsInputRoot({
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange(v);
				}
			}
		),
		delimiter: box.with(() => delimiter),
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
