<script lang="ts">
	import { melt } from "@melt-ui/svelte";

	let { asChild, children, child } = $props();
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps} />
{/if}
