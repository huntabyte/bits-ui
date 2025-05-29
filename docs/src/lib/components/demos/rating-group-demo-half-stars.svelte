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
				class="text-foreground focus-visible:ring-foreground data-[state=inactive]:text-muted-foreground size-8 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[readonly]:cursor-default"
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
