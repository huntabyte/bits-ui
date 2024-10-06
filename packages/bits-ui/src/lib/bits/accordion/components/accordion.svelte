<script lang="ts">
	import { type WritableBox, box, mergeProps } from "svelte-toolbelt";
	import { useAccordionRoot } from "../accordion.svelte.js";
	import type { AccordionRootProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		disabled = false,
		children,
		child,
		type,
		value = $bindable(),
		ref = $bindable(null),
		id = useId(),
		onValueChange = noop,
		loop = true,
		orientation = "vertical",
		controlledValue = false,
		...restProps
	}: AccordionRootProps = $props();

	value === undefined && (value = type === "single" ? "" : []);

	const rootState = useAccordionRoot({
		type,
		value: box.with(
			() => value!,
			(v) => {
				if (controlledValue) {
					onValueChange(v as any);
				} else {
					value = v;
					onValueChange(v as any);
				}
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
