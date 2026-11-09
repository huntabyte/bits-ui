<script lang="ts">
	import { RatingGroup } from "bits-ui";
	let { count, value = 0 }: { count: number; value?: number } = $props();
</script>

{#each { length: count }, i (i)}
	<RatingGroup.Root {value} max={10} allowHalf>
		{#snippet children({ items })}
			{#each items as item (item.index)}
				<RatingGroup.Item index={item.index}>{item.state}</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>
{/each}
