<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RadioGroupProps } from "../index.js";
	import { useMenuRadioGroup } from "../menu.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		value = $bindable(""),
		onValueChange = noop,
		...restProps
	}: RadioGroupProps = $props();

	const radioGroupState = useMenuRadioGroup({
		value: box.with(
			() => value,
			(v) => {
				if (value !== v) {
					value = v;
					onValueChange(v);
				}
			}
		),
	});

	const mergedProps = $derived(mergeProps(restProps, radioGroupState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
