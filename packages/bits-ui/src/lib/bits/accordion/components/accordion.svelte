<script lang="ts">
	import { type WritableBox, box } from "runed";
	import { useAccordionRoot } from "../accordion.svelte.js";
	import type { RootProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		disabled = false,
		asChild,
		children,
		child,
		type,
		value = $bindable(),
		el = $bindable(),
		id = useId(),
		onValueChange,
		loop = true,
		orientation = "vertical",
		...restProps
	}: RootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const state = useAccordionRoot({
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
