<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import type { GroupProps } from "../index.js";
	import { useToolbarGroup } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
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
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
