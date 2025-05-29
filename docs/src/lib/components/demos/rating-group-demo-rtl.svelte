<script lang="ts">
	import { unstable_RatingGroup as RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	import StarHalf from "phosphor-svelte/lib/StarHalf";
	let value = $state(3);
</script>

<div class="flex flex-col gap-4" dir="rtl">
	<div class="flex flex-col gap-2">
		<h3 class="text-sm font-medium">تقييم بالنجوم (RTL)</h3>
		<p class="text-muted-foreground text-sm">Rating group with right-to-left text direction.</p>
	</div>

	<RatingGroup.Root bind:value max={5} class="flex gap-1" allowHalf>
		{#snippet children({ items })}
			{#each items as item (item.index)}
				<RatingGroup.Item
					index={item.index}
					class="text-muted-foreground data-[state=active]:text-foreground data-[state=partial]:text-foreground size-8 cursor-pointer transition-colors md:size-6"
				>
					{#if item.state === "partial"}
						<StarHalf class="size-full fill-current rtl:scale-x-[-1]" weight="fill" />
					{:else if item.state === "active"}
						<Star class="size-full fill-current" weight="fill" />
					{:else}
						<Star class="size-full" />
					{/if}
				</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>

	<p class="text-muted-foreground text-sm">
		التقييم: {value} من 5 نجوم
	</p>
</div>
