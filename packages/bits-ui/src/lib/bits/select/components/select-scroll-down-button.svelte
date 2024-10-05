<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectScrollUpButtonProps } from "../types.js";
	import { useSelectScrollDownButton } from "../select.svelte.js";
	import SelectScrollDownButtonMounted from "./select-scroll-down-button-mounted.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let { id = useId(), ref = $bindable(null), ...restProps }: SelectScrollUpButtonProps = $props();

	const mounted = box(false);

	const scrollDownButtonState = useSelectScrollDownButton({
		id: box.with(() => id),
		mounted: box.from(mounted),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const { child: _child, children: _children, ...restWithoutChildren } = restProps;
	const mergedProps = $derived(mergeProps(restWithoutChildren, scrollDownButtonState.props));
	const { style: _style, ...restWithoutStyle } = restProps;
</script>

{#if scrollDownButtonState.canScrollDown}
	<SelectScrollDownButtonMounted {mounted} {...restWithoutStyle} {...mergedProps} />
{/if}
