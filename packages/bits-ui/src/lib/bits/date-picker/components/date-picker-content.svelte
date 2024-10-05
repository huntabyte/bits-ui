<script lang="ts">
	import type { DatePickerContentProps } from "../types.js";
	import PopoverContent from "$lib/bits/popover/components/popover-content.svelte";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { pickerOpenFocus } from "$lib/internal/date-time/calendar-helpers.svelte.js";

	let { ref = $bindable(null), onOpenAutoFocus, ...restProps }: DatePickerContentProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	) as any;
</script>

<PopoverContent {...mergedProps} bind:ref {...restProps} />
