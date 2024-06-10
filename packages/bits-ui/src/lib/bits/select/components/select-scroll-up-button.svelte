<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ScrollUpButtonProps } from "../index.js";
	import { useSelectScrollUpButton } from "../select.svelte.js";
	import SelectScrollUpButtonMounted from "./select-scroll-up-button-mounted.svelte";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { id = useId(), el = $bindable(), ...restProps }: ScrollUpButtonProps = $props();

	const mounted = box(false);

	const state = useSelectScrollUpButton({
		id: box.with(() => id),
		mounted: box.from(mounted),
	});

	// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
	const { asChild, child, children, ...restWithoutChildren } = restProps;
	const mergedProps = $derived(mergeProps(restWithoutChildren, state.props));
	// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
	const { style, ...restWithoutStyle } = restProps;
</script>

{#if state.canScrollUp}
	<SelectScrollUpButtonMounted bind:el {...restWithoutStyle} {...mergedProps} {mounted} />
{/if}
