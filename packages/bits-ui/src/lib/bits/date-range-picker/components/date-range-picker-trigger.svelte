<script lang="ts">
	import type { DateRangePickerTriggerProps } from "../types.js";
	import PopoverTrigger from "$lib/bits/popover/components/popover-trigger.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { DATE_RANGE_FIELD_ROOT_ATTR } from "$lib/bits/date-range-field/date-range-field.svelte.js";
	import {
		handleSegmentNavigation,
		isSegmentNavigationKey,
	} from "$lib/internal/date-time/field/segments.js";

	let { ref = $bindable(null), onkeydown, ...restProps }: DateRangePickerTriggerProps = $props();

	function onKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			const currNode = e.currentTarget as HTMLElement;
			const dateFieldInputNode = currNode.closest(
				`[${DATE_RANGE_FIELD_ROOT_ATTR}]`
			) as HTMLElement;
			if (!dateFieldInputNode) return;
			handleSegmentNavigation(e, dateFieldInputNode);
		}
	}

	const mergedProps = $derived(mergeProps({ onkeydown }, { onkeydown: onKeydown })) as any;
</script>

<PopoverTrigger {...restProps} bind:ref data-segment="trigger" {...mergedProps} />
