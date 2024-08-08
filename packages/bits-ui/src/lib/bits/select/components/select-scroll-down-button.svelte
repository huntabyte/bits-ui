<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ScrollUpButtonProps } from "../index.js";
	import { useSelectScrollDownButton } from "../select.svelte.js";
	import SelectScrollDownButtonMounted from "./select-scroll-down-button-mounted.svelte";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { id = useId(), ref = $bindable(null), ...restProps }: ScrollUpButtonProps = $props();

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
