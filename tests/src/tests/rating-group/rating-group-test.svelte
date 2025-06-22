<script lang="ts" module>
	import { unstable_RatingGroup as RatingGroup } from "bits-ui";

	export type RatingGroupTestProps = Omit<RatingGroup.RootProps, "child" | "children">;
</script>

<script lang="ts">
	let { value = 0, max = 5, ...restProps }: RatingGroupTestProps = $props();
</script>

<main>
	<RatingGroup.Root data-testid="root" bind:value {max} {...restProps}>
		{#snippet children({ items })}
			{#each items as item (item.index)}
				<RatingGroup.Item
					index={item.index}
					data-testid="item-{item.index}"
					class="rating-item h-10 w-10"
				>
					<span data-testid="star-{item.index}"> ★ </span>
					<span data-testid="state-{item.index}">{item.state}</span>
				</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>

	<div data-testid="value-display">{value}</div>
	<button data-testid="reset-button" onclick={() => (value = 0)}> Reset </button>
	<button data-testid="set-half-button" onclick={() => (value = 2.5)}> Set 2.5 </button>
</main>
