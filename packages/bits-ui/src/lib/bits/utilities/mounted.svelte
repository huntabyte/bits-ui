<script lang="ts">
	// eslint-disable-next-line unused-imports/no-unused-vars, ts/no-unused-vars
	let { isMounted = $bindable(false) }: { isMounted: boolean } = $props();

	$effect(() => {
		isMounted = true;
		return () => {
			isMounted = false;
		};
	});
</script>
