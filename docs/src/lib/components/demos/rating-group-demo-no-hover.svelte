<script lang="ts">
	import { unstable_RatingGroup as RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";

	let value = $state(2);
</script>

<div class="flex select-none flex-col gap-4">
	<div class="flex flex-col gap-2">
		<h3 class="text-sm font-medium">Hover preview disabled</h3>
		<p class="text-muted-foreground text-sm">
			Only shows selected rating on hover, no preview of potential selection.
		</p>
	</div>

	<RatingGroup.Root bind:value max={5} hoverPreview={false} class="flex gap-1">
		{#snippet children({ items })}
			{#each items as item (item.index)}
				<RatingGroup.Item
					index={item.index}
					class="text-muted-foreground data-[state=active]:text-foreground group size-8 cursor-pointer transition-colors md:size-6"
				>
					<Star class="size-full group-data-[state=active]:fill-current" weight="fill" />
				</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>

	<p class="text-muted-foreground text-sm">
		Rating: {value} out of 5 stars
	</p>
</div>
