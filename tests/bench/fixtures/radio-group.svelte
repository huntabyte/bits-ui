<script lang="ts">
	import { RadioGroup } from "bits-ui";
	let { count, value = "" }: { count: number; value?: string } = $props();
</script>

<RadioGroup.Root bind:value name="rg">
	{#each { length: count }, i (i)}
		<RadioGroup.Item value={i} data-bench="item">
			{#snippet children({ checked })}{checked ? "•" : ""}{/snippet}
		</RadioGroup.Item>
	{/each}
</RadioGroup.Root>
