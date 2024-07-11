<script lang="ts">
	import { type WritableBox, box } from "svelte-toolbelt";
	import { useAccordionRoot } from "../accordion.svelte.js";
	import type { RootProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		disabled = false,
		children,
		child,
		type,
		value = $bindable(),
		ref = $bindable(null),
		id = useId(),
		onValueChange,
		loop = true,
		orientation = "vertical",
		...restProps
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const rootState = useAccordionRoot({
		type,
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				onValueChange?.(v as any);
			}
		) as WritableBox<string> | WritableBox<string[]>,
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		loop: box.with(() => loop),
		orientation: box.with(() => orientation),
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
