<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RadioGroupProps } from "../index.js";
	import { useMenuRadioGroup } from "../menu.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		id = useId(),
		children,
		child,
		ref = $bindable(null),
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
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, radioGroupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
