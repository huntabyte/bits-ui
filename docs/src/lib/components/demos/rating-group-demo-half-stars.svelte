<script lang="ts">
	import { unstable_RatingGroup as RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	import StarHalf from "phosphor-svelte/lib/StarHalf";
	let value = $state(3);
</script>

<RatingGroup.Root bind:value max={5} allowHalf={true} class="flex gap-1">
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item
				index={item.index}
				class="text-foreground data-[state=inactive]:text-muted-foreground size-10 cursor-pointer transition-colors data-[readonly]:cursor-default md:size-8"
			>
				{#if item.state === "inactive"}
					<Star class="size-full" />
				{:else if item.state === "active"}
					<Star class="size-full fill-current" weight="fill" />
				{:else if item.state === "partial"}
					<StarHalf class="size-full fill-current" weight="fill" />
				{/if}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
