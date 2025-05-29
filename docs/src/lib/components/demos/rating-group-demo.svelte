<script lang="ts">
	import { experimental_RatingGroup as RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	let value = $state(3);
</script>

<RatingGroup.Root bind:value max={5} class="flex gap-1">
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item
				index={item.index}
				class="text-foreground hover:text-foreground focus-visible:ring-foreground data-[state=inactive]:text-muted-foreground group size-8 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				<Star class="size-full" weight="fill" />
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
