<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import type { GroupProps } from "../index.js";
	import { useToolbarGroup } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		value = $bindable(),
		onValueChange,
		type,
		disabled = false,
		...restProps
	}: GroupProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const groupState = useToolbarGroup({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				onValueChange?.(v as any);
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
