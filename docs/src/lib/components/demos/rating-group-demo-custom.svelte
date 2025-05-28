<script lang="ts">
	import { RatingGroup } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	import StarHalf from "phosphor-svelte/lib/StarHalf";

	let value = $state(3.5);
	let readonly = $state(false);
	let disabled = $state(false);
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap gap-4 text-sm">
		<label class="flex items-center gap-2">
			<input type="checkbox" bind:checked={readonly} class="rounded" />
			Readonly
		</label>
		<label class="flex items-center gap-2">
			<input type="checkbox" bind:checked={disabled} class="rounded" />
			Disabled
		</label>
	</div>

	<div class="flex flex-col gap-2">
		<h3 class="text-sm font-medium">Half-star rating</h3>
		<RatingGroup.Root
			bind:value
			max={5}
			allowHalf={true}
			{readonly}
			{disabled}
			class="flex gap-1"
		>
			{#snippet children({ items })}
				{#each items as item (item.index)}
					<RatingGroup.Item
						index={item.index}
						class="text-muted-foreground hover:text-foreground focus-visible:ring-foreground size-8 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[readonly]:cursor-default data-[state=active]:text-yellow-500 data-[state=partial]:text-yellow-500"
					>
						<div class="relative size-full">
							{#if item.state === "inactive"}
								<Star class="size-full" />
							{:else if item.state === "active"}
								<Star class="size-full fill-current" weight="fill" />
							{:else if item.state === "partial"}
								<StarHalf class="size-full fill-current" weight="fill" />
							{/if}
						</div>
					</RatingGroup.Item>
				{/each}
			{/snippet}
		</RatingGroup.Root>

		<p class="text-muted-foreground text-sm">
			Rating: {value} out of 5 stars
		</p>
	</div>

	<div class="flex flex-col gap-4">
		<h3 class="text-sm font-medium">Different sizes</h3>

		<div class="flex flex-col gap-1">
			<span class="text-muted-foreground text-xs">Small</span>
			<RatingGroup.Root value={4} max={5} readonly class="flex gap-0.5">
				{#snippet children({ items })}
					{#each items as item (item.index)}
						<RatingGroup.Item
							index={item.index}
							class="text-muted-foreground size-4 data-[state=active]:text-yellow-500"
						>
							{#if item.state === "active"}
								<Star class="size-full fill-current" weight="fill" />
							{:else}
								<Star class="size-full" />
							{/if}
						</RatingGroup.Item>
					{/each}
				{/snippet}
			</RatingGroup.Root>
		</div>

		<div class="flex flex-col gap-1">
			<span class="text-muted-foreground text-xs">Large</span>
			<RatingGroup.Root value={2} max={5} readonly class="flex gap-2">
				{#snippet children({ items })}
					{#each items as item (item.index)}
						<RatingGroup.Item
							index={item.index}
							class="text-muted-foreground size-10 data-[state=active]:text-yellow-500"
						>
							{#if item.state === "active"}
								<Star class="size-full fill-current" weight="fill" />
							{:else}
								<Star class="size-full" />
							{/if}
						</RatingGroup.Item>
					{/each}
				{/snippet}
			</RatingGroup.Root>
		</div>
	</div>
</div>
