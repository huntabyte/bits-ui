<script lang="ts">
	import type { ContentStaticProps } from "../index.js";
	import PopoverContentStatic from "$lib/bits/popover/components/popover-content-static.svelte";
	import { pickerOpenFocus } from "$lib/shared/date/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { ref = $bindable(null), onMountAutoFocus, ...restProps }: ContentStaticProps = $props();

	const mergedProps = $derived(
		mergeProps({ onMountAutoFocus }, { onMountAutoFocus: pickerOpenFocus })
	) as any;
</script>

<PopoverContentStatic {...mergedProps} bind:ref {...restProps} />
