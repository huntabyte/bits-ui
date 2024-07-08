<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import PopoverTrigger from "$lib/bits/popover/components/popover-trigger.svelte";

	let { ref = $bindable(null), ...restProps }: TriggerProps = $props();
</script>

<PopoverTrigger {...restProps} bind:ref data-segment="trigger" />
