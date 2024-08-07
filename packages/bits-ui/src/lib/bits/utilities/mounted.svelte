<script lang="ts">
	import { untrack } from "svelte";
	import { noop } from "$lib/internal/callbacks.js";

	let {
		isMounted = $bindable(false),
		onMountedChange = noop,
	}: { isMounted?: boolean; onMountedChange?: (mounted: boolean) => void } = $props();

	$effect(() => {
		untrack(() => {
			isMounted = true;
			onMountedChange(true);
		});
		return () => {
			isMounted = false;
			onMountedChange(false);
		};
	});
</script>
