# RatingGroup

A headless rating component that allows users to provide ratings using customizable items (like stars).

## Features

-   Flexible number of rating items (configurable via `max` prop)
-   Half-value support via `allowHalf` prop
-   Keyboard navigation with arrow keys
-   Form integration with hidden input
-   Readonly mode
-   Accessibility support with ARIA attributes

## Basic Usage

```svelte
<script>
	import { RatingGroup } from "$lib/bits/rating-group";

	let rating = $state(0);
</script>

<RatingGroup.Root bind:value={rating} max={5}>
	{#snippet children({ items })}
		{#each items as item}
			<RatingGroup.Item value={item.value}>
				{#snippet children({ active, partial })}
					<span class="star" class:active class:partial>
						{active || partial ? "★" : "☆"}
					</span>
				{/snippet}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>

<p>Current rating: {rating}</p>
```

## With Half Values

```svelte
<script>
	import { RatingGroup } from "$lib/bits/rating-group";

	let rating = $state(0);
</script>

<RatingGroup.Root bind:value={rating} max={5} allowHalf>
	{#snippet children({ items })}
		{#each items as item}
			<RatingGroup.Item value={item.value}>
				{#snippet children({ active, partial })}
					<span class="star" class:active class:partial>
						{#if active}
							★
						{:else if partial}
							⯨
						{:else}
							☆
						{/if}
					</span>
				{/snippet}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
```

## Form Integration

```svelte
<script>
	import { RatingGroup } from "$lib/bits/rating-group";

	let rating = $state(0);
</script>

<form>
	<RatingGroup.Root bind:value={rating} name="rating" required>
		{#snippet children({ items })}
			{#each items as item}
				<RatingGroup.Item value={item.value}>
					{#snippet children({ active })}
						<button type="button" class="star" class:active>
							{active ? "★" : "☆"}
						</button>
					{/snippet}
				</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>

	<button type="submit">Submit Rating</button>
</form>
```

## Props

### RatingGroup.Root

-   `value` - Current rating value (bindable)
-   `max` - Maximum rating value (default: 5)
-   `allowHalf` - Allow half-star ratings (default: false)
-   `readonly` - Make the rating readonly (default: false)
-   `disabled` - Disable the rating group (default: false)
-   `orientation` - Layout orientation (default: "horizontal")
-   `name` - Form field name for hidden input
-   `required` - Mark as required for form validation
-   `onValueChange` - Callback when value changes

### RatingGroup.Item

-   `value` - The rating value this item represents
-   `disabled` - Disable this specific item

## Keyboard Navigation

-   **Arrow Keys**: Navigate between items and change rating
-   **Space/Enter**: Set rating to current item
-   **Home**: Set rating to 0
-   **End**: Set rating to maximum
-   **Number Keys**: Set rating directly (0-9)
