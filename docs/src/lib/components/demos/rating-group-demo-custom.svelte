<script lang="ts">
	import { unstable_RatingGroup as RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	import type { ComponentProps } from "svelte";

	let { value = 3.5, ...restProps }: ComponentProps<typeof RatingGroup.Root> = $props();
</script>

<RatingGroup.Root {...restProps} {value} class="flex gap-1">
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item
				index={item.index}
				class="text-foreground data-[state=inactive]:text-muted-foreground data-disabled:cursor-not-allowed size-10 cursor-pointer transition-colors disabled:opacity-50 data-[readonly]:cursor-default md:size-8"
			>
				<div class="relative size-full">
					<Star class="size-full fill-current" weight="fill" />
				</div>
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
