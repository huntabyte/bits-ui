<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ScrollUpButtonProps } from "../index.js";
	import { useSelectScrollUpButton } from "../select.svelte.js";
	import SelectScrollUpButtonMounted from "./select-scroll-up-button-mounted.svelte";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { id = useId(), ref = $bindable(null), ...restProps }: ScrollUpButtonProps = $props();

	const mounted = box(false);

	const scrollUpButtonState = useSelectScrollUpButton({
		id: box.with(() => id),
		mounted: box.from(mounted),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
	const { asChild, child, children, ...restWithoutChildren } = restProps;
	const mergedProps = $derived(mergeProps(restWithoutChildren, scrollUpButtonState.props));
	// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
	const { style, ...restWithoutStyle } = restProps;
</script>

{#if scrollUpButtonState.canScrollUp}
	<SelectScrollUpButtonMounted {...restWithoutStyle} {...mergedProps} {mounted} />
{/if}
