<script lang="ts">
	import type { ContentProps } from "../index.js";
	import PopoverContent from "$lib/bits/popover/components/popover-content.svelte";
	import { pickerOpenFocus } from "$lib/shared/date/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { ref = $bindable(null), onOpenAutoFocus, ...restProps }: ContentProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	) as any;
</script>

<PopoverContent {...mergedProps} bind:ref {...restProps} />
