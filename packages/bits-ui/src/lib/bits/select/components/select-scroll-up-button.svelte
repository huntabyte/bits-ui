<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectScrollUpButtonProps } from "../types.js";
	import { useSelectScrollUpButton } from "../select.svelte.js";
	import SelectScrollUpButtonMounted from "./select-scroll-up-button-mounted.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let { id = useId(), ref = $bindable(null), ...restProps }: SelectScrollUpButtonProps = $props();

	const mounted = box(false);

	const scrollUpButtonState = useSelectScrollUpButton({
		id: box.with(() => id),
		mounted: box.from(mounted),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const { child: _child, children: _children, ...restWithoutChildren } = restProps;
	const mergedProps = $derived(mergeProps(restWithoutChildren, scrollUpButtonState.props));
	const { style: _style, ...restWithoutStyle } = restProps;
</script>

{#if scrollUpButtonState.canScrollUp}
	<SelectScrollUpButtonMounted {...restWithoutStyle} {...mergedProps} {mounted} />
{/if}
