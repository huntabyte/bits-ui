<script lang="ts">
	import type { DatePickerTriggerProps } from "../types.js";
	import PopoverTrigger from "$lib/bits/popover/components/popover-trigger.svelte";
	import { handleSegmentNavigation, isSegmentNavigationKey } from "$lib/shared/date/field.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { DATE_FIELD_INPUT_ATTR } from "$lib/bits/date-field/date-field.svelte.js";

	let { ref = $bindable(null), onkeydown, ...restProps }: DatePickerTriggerProps = $props();

	function onKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			const currNode = e.currentTarget as HTMLElement;
			const dateFieldInputNode = currNode.closest(
				`[${DATE_FIELD_INPUT_ATTR}]`
			) as HTMLElement;
			if (!dateFieldInputNode) return;
			handleSegmentNavigation(e, dateFieldInputNode);
		}
	}

	const mergedProps = $derived(mergeProps({ onkeydown }, { onkeydown: onKeydown })) as any;
</script>

<PopoverTrigger {...restProps} bind:ref data-segment="trigger" {...mergedProps} />
