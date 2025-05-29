<script lang="ts">
	import { onMountEffect } from "svelte-toolbelt";
	import { noop } from "$lib/internal/noop.js";

	let {
		mounted = $bindable(false),
		onMountedChange = noop,
	}: { mounted?: boolean; onMountedChange?: (mounted: boolean) => void } = $props();

	onMountEffect(() => {
		mounted = true;
		onMountedChange(true);
		return () => {
			mounted = false;
			onMountedChange(false);
		};
	});
</script>
