<script lang="ts">
	let { isMounted = $bindable(false) }: { isMounted: boolean } = $props();

	$effect(() => {
		isMounted = true;
		return () => {
			isMounted = false;
		};
	});
</script>
