<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TriggerProps } from "../index.js";
	import { useMenuDropdownTrigger } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		disabled = false,
		...restProps
	}: TriggerProps = $props();

	const triggerState = useMenuDropdownTrigger({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
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
