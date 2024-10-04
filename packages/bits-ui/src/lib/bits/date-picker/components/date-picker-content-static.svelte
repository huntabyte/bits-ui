<script lang="ts">
	import type { DatePickerContentStaticProps } from "../types.js";
	import PopoverContentStatic from "$lib/bits/popover/components/popover-content-static.svelte";
	import { pickerOpenFocus } from "$lib/shared/date/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		ref = $bindable(null),
		onOpenAutoFocus,
		...restProps
	}: DatePickerContentStaticProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	);
</script>

<PopoverContentStatic {...mergedProps} bind:ref {...restProps} />
