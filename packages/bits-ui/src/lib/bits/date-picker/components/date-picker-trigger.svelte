<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import PopoverTrigger from "$lib/bits/popover/components/popover-trigger.svelte";
	import { handleSegmentNavigation, isSegmentNavigationKey } from "$lib/shared/date/field.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { ref = $bindable(null), onkeydown, ...restProps }: TriggerProps = $props();

	function onKeydown(e: KeyboardEvent) {
		if (isSegmentNavigationKey(e.key)) {
			const currNode = e.currentTarget as HTMLElement;
			const dateFieldInputNode = currNode.closest("[data-date-field-input]") as HTMLElement;
			if (!dateFieldInputNode) return;
			handleSegmentNavigation(e, dateFieldInputNode);
		}
	}

	const mergedProps = $derived(mergeProps({ onkeydown }, { onkeydown: onKeydown })) as any;
</script>

<PopoverTrigger {...restProps} bind:ref data-segment="trigger" {...mergedProps} />
