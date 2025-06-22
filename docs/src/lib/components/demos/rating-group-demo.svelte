<script lang="ts">
	import { unstable_RatingGroup as RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	let value = $state(3);
</script>

<RatingGroup.Root bind:value max={5} class="flex gap-1">
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item
				index={item.index}
				class="text-foreground hover:text-foreground data-[state=inactive]:text-muted-foreground group size-10 cursor-pointer transition-colors md:size-8"
			>
				<Star class="size-full" weight="fill" />
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
