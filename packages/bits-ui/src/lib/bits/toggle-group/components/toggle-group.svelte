<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useToggleGroupRoot } from "../toggle-group.svelte.js";
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
		loop = true,
		orientation = "horizontal",
		rovingFocus = true,
		...restProps
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const rootState = useToggleGroupRoot({
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
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
