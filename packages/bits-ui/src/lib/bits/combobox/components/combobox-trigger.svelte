<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ComboboxTriggerProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { ComboboxTriggerState } from "$lib/bits/select/select.svelte.js";
	import FloatingLayerAnchor from "$lib/bits/utilities/floating-layer/components/floating-layer-anchor.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		type = "button",
		...restProps
	}: ComboboxTriggerProps = $props();

	const triggerState = ComboboxTriggerState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
	const isFloatingAnchor = $derived.by(() => {
		if (triggerState.root.inputNode && !triggerState.root.hasInputInContent) {
			return false;
		}

		if (!triggerState.root.inputNode) {
			return true;
		}
		return false;
	});
</script>

{#if isFloatingAnchor}
	<FloatingLayerAnchor {id} ref={triggerState.opts.ref}>
		{#if child}
			{@render child({ props: mergedProps })}
		{:else}
			<button {...mergedProps}>
				{@render children?.()}
			</button>
		{/if}
	</FloatingLayerAnchor>
{:else if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
