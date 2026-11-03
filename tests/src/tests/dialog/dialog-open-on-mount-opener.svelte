<script lang="ts">
	import { onMount } from "svelte";

	let { onmount }: { onmount: () => void } = $props();

	onMount(onmount);
</script>
