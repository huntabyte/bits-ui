<script lang="ts">
	import { RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	let value = $state(3);
</script>

<div class="flex flex-col gap-4">
	<RatingGroup.Root bind:value max={5} class="flex gap-1">
		{#snippet children({ items })}
			{#each items as item (item.value)}
				<RatingGroup.Item
					value={item.value}
					class="text-muted-foreground hover:text-foreground focus-visible:ring-foreground size-6 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=active]:text-yellow-500"
				>
					{#snippet children({ active })}
						<Star class="size-full {active ? 'fill-current' : ''}" />
					{/snippet}
				</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>

	<p class="text-muted-foreground text-sm">
		Rating: {value} out of 5 stars
	</p>
</div>
