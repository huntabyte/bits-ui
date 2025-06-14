<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { SelectTriggerState } from "../select.svelte.js";
	import type { SelectTriggerProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		child,
		children,
		type = "button",
		...restProps
	}: SelectTriggerProps = $props();

	const triggerState = SelectTriggerState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props, { type }));
</script>

<FloatingLayer.Anchor {id} ref={triggerState.opts.ref}>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<button {...mergedProps}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
