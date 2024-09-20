<script lang="ts">
	import type { ContentStaticProps } from "../index.js";
	import PopoverContentStatic from "$lib/bits/popover/components/popover-content-static.svelte";
	import { pickerOpenFocus } from "$lib/shared/date/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { ref = $bindable(null), onOpenAutoFocus, ...restProps }: ContentStaticProps = $props();

	const mergedProps = $derived(
		mergeProps({ onOpenAutoFocus }, { onOpenAutoFocus: pickerOpenFocus })
	);
</script>

<PopoverContentStatic {...mergedProps} bind:ref {...restProps} />
