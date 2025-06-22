<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SliderThumbLabelProps } from "../types.js";
	import { SliderRootContext, SliderThumbLabelState } from "../slider.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		index,
		position: positionProp,
		...restProps
	}: SliderThumbLabelProps = $props();

	const root = SliderRootContext.get();

	const position = $derived.by(() => {
		if (positionProp !== undefined) return positionProp;
		switch (root.direction) {
			case "lr":
			case "rl":
				return "top";
			case "tb":
			case "bt":
				return "left";
		}
	});

	const tickLabelState = SliderThumbLabelState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		index: box.with(() => index),
		position: box.with(() => position),
	});

	const mergedProps = $derived(mergeProps(restProps, tickLabelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>{@render children?.()}</span>
{/if}
