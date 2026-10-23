<script lang="ts">
	import { ToggleGroup } from "bits-ui";
	let { count, value = [] }: { count: number; value?: string[] } = $props();
</script>

<ToggleGroup.Root type="multiple" bind:value>
	{#each { length: count }, i (i)}
		<ToggleGroup.Item value="{i}" data-bench="item">{i}</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>
