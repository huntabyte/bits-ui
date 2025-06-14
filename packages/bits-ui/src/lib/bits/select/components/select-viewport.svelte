<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SelectViewportProps } from "../types.js";
	import { SelectViewportState } from "../select.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: SelectViewportProps = $props();

	const viewportState = SelectViewportState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<style>
	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */
	:global([data-select-viewport]) {
		scrollbar-width: none !important;
		-ms-overflow-style: none !important;
		-webkit-overflow-scrolling: touch !important;
	}

	:global([data-combobox-viewport]) {
		scrollbar-width: none !important;
		-ms-overflow-style: none !important;
		-webkit-overflow-scrolling: touch !important;
	}

	:global([data-combobox-viewport])::-webkit-scrollbar {
		display: none !important;
	}
	:global([data-select-viewport])::-webkit-scrollbar {
		display: none !important;
	}
</style>
