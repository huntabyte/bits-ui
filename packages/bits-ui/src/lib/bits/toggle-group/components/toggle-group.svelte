<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useToggleGroupRoot } from "../toggle-group.svelte.js";
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
		loop = true,
		orientation = "horizontal",
		rovingFocus = true,
		...restProps
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const state = useToggleGroupRoot({
		id: box.with(() => id),
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				onValueChange?.(v as any);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		disabled: box.with(() => disabled),
		loop: box.with(() => loop),
		orientation: box.with(() => orientation),
		rovingFocus: box.with(() => rovingFocus),
		type,
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
