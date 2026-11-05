<script lang="ts">
	import { RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	let value = $state(3);
</script>

<RatingGroup.Root bind:value max={5} class="flex gap-1">
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item
				index={item.index}
				class="group size-10 cursor-pointer text-foreground transition-colors hover:text-foreground data-[state=inactive]:text-muted-foreground md:size-8"
			>
				<Star class="size-full" weight="fill" />
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
