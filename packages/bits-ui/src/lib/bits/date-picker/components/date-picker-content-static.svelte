<script lang="ts">
	import type { DatePickerContentStaticProps } from "../types.js";
	import PopoverContentStatic from "$lib/bits/popover/components/popover-content-static.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { pickerOpenFocus } from "$lib/internal/date-time/calendar-helpers.svelte.js";

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
