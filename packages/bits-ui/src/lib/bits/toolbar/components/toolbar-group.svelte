<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import { mergeProps } from "svelte-toolbelt";
	import type { ToolbarGroupProps } from "../types.js";
	import { useToolbarGroup } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		type,
		disabled = false,
		controlledValue = false,
		child,
		children,
		...restProps
	}: ToolbarGroupProps = $props();

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];
		if (controlledValue) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onValueChange(defaultValue as any);
		} else {
			value = defaultValue;
		}
	}

	const groupState = useToolbarGroup({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		type,
		value: box.with(
			() => value!,
			(v) => {
				if (controlledValue) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					onValueChange(v as any);
				} else {
					value = v;
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					onValueChange(v as any);
				}
			}
		) as WritableBox<string> | WritableBox<string[]>,
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
