<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useListboxTrigger } from "../listbox.svelte.js";
	import type { ListboxTriggerProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: ListboxTriggerProps = $props();

	const triggerState = useListboxTrigger({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

<FloatingLayer.Anchor {id}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
