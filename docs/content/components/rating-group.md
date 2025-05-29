---
title: Rating Group
description: Allows users to provide ratings using customizable items (like stars).
---

<script>
	import { APISection, ComponentPreviewV2, RatingGroupDemo, RatingGroupDemoCustom, RatingGroupDemoNoHover, RatingGroupDemoRtl, RatingGroupDemoHalfStars, Callout, DemoContainer } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="rating-group-demo" componentName="Rating Group">

{#snippet preview()}
<RatingGroupDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { experimental_RatingGroup as RatingGroup } from "bits-ui";
</script>

<RatingGroup.Root max={5}>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item index={item.index}>
				{#if item.state === "active"}
					⭐
				{:else}
					☆
				{/if}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
```

## Reusable Components

It's recommended to use the `RatingGroup` primitives to create your own custom rating components that can be used throughout your application.

In the example below, we're creating a custom `MyRatingGroup` component that renders a rating group with configurable maximum rating and styling.

```svelte title="MyRatingGroup.svelte"
<script lang="ts">
	import { experimental_RatingGroup as RatingGroup, type WithoutChildrenOrChild } from "bits-ui";
	import Star from "phosphor-svelte/lib/Star";
	import StarHalf from "phosphor-svelte/lib/StarHalf";

	let {
		value = $bindable(0),
		ref = $bindable(null),
		showLabel = true,
		max = 5,
		...restProps
	}: WithoutChildrenOrChild<RatingGroup.RootProps> & {
		showLabel?: boolean;
	} = $props();
</script>

<div class="flex flex-col gap-2">
	<RatingGroup.Root bind:value bind:ref {max} {...restProps}>
		{#snippet children({ items })}
			{#each items as item (item.index)}
				<RatingGroup.Item index={item.index}>
					{#if item.state === "inactive"}
						<Star />
					{:else if item.state === "active"}
						<Star weight="fill" />
					{:else if item.state === "partial"}
						<StarHalf weight="fill" />
					{/if}
				</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>

	{#if showLabel}
		<p class="text-muted-foreground text-sm">
			Rating: {value} out of {max} stars
		</p>
	{/if}
</div>
```

You can then use the `MyRatingGroup` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyRatingGroup from "$lib/components/MyRatingGroup.svelte";
	let productRating = $state(4);
</script>

<MyRatingGroup bind:value={productRating} max={5} allowHalf />
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
	import { experimental_RatingGroup as RatingGroup } from "bits-ui";
	let myRating = $state(3);
</script>

<button onclick={() => (myRating = 5)}> Give 5 stars </button>

<RatingGroup.Root bind:value={myRating} max={5}>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item index={item.index}>
				{#if item.state === "active"}⭐{:else}☆{/if}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
	import { experimental_RatingGroup as RatingGroup } from "bits-ui";
	let myRating = $state(0);

	function getValue() {
		return myRating;
	}

	function setValue(newValue: number) {
		// Add custom logic here, like validation or analytics
		if (newValue >= 0 && newValue <= 5) {
			myRating = newValue;
		}
	}
</script>

<RatingGroup.Root bind:value={getValue, setValue} max={5}>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item index={item.index}>
				{#if item.state === "active"}⭐{:else}☆{/if}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
```

## HTML Forms

If you set the `name` prop on the `RatingGroup.Root` component, a hidden input element will be rendered to submit the rating value to a form.

```svelte /name="productRating"/
<RatingGroup.Root name="productRating" max={5}>
	<!-- ... -->
</RatingGroup.Root>
```

### Required

To make the hidden input element `required` you can set the `required` prop on the `RatingGroup.Root` component.

```svelte /required/
<RatingGroup.Root required max={5}>
	<!-- ... -->
</RatingGroup.Root>
```

## Half Ratings

The rating group supports half ratings when you set the `allowHalf` prop to `true`. This allows for more precise ratings like 3.5 stars.

```svelte /allowHalf/
<RatingGroup.Root allowHalf>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item index={item.index}>
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
```

<ComponentPreviewV2 name="rating-group-demo-half-stars" componentName="Rating Group Half Stars">

{#snippet preview()}
<RatingGroupDemoHalfStars />
{/snippet}

</ComponentPreviewV2>

## Readonly Mode

You can make the rating group readonly by setting the `readonly` prop to `true`. This is useful for displaying existing ratings without allowing user interaction.

```svelte /readonly/
<RatingGroup.Root readonly value={4.5}>
	<!-- ... -->
</RatingGroup.Root>
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<RatingGroupDemoCustom readonly value={4.5} />
</DemoContainer>

## Disabled State

You can disable the entire rating group by setting the `disabled` prop to `true`.

```svelte /disabled/
<RatingGroup.Root disabled max={5}>
	<!-- ... -->
</RatingGroup.Root>
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<RatingGroupDemoCustom disabled />
</DemoContainer>

## Hover Preview

By default, the rating group shows a preview of the potential rating when hovering over items. You can disable this behavior by setting `hoverPreview` to `false`.

```svelte /hoverPreview={false}/
<RatingGroup.Root hoverPreview={false} max={5}>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item index={item.index}>
				{#if item.state === "active"}⭐{:else}☆{/if}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
```

When disabled, only the currently selected rating will be highlighted, and hovering over items won't show a preview of the potential selection.

<ComponentPreviewV2 name="rating-group-demo-no-hover" componentName="Rating Group No Hover Preview">

{#snippet preview()}
<RatingGroupDemoNoHover />
{/snippet}

</ComponentPreviewV2>

## RTL Support

The rating group automatically adapts to right-to-left (RTL) text direction. Simply set the `dir="rtl"` attribute on a parent element:

```svelte
<div dir="rtl">
	<RatingGroup.Root max={5}>
		{#snippet children({ items })}
			{#each items as item (item.index)}
				<RatingGroup.Item index={item.index}>
					{#if item.state === "active"}⭐{:else}☆{/if}
				</RatingGroup.Item>
			{/each}
		{/snippet}
	</RatingGroup.Root>
</div>
```

In RTL mode, the arrow key navigation is automatically reversed to match the visual direction.

<ComponentPreviewV2 name="rating-group-demo-rtl" componentName="Rating Group RTL">

{#snippet preview()}
<RatingGroupDemoRtl />
{/snippet}

</ComponentPreviewV2>

## Maximum Rating

The `max` prop determines the maximum rating value and the number of rating items rendered. (defaults to `5`)

```svelte /max={10}/
<RatingGroup.Root max={3}>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item index={item.index}>
				{item.index + 1}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<RatingGroupDemoCustom max={3} />
</DemoContainer>

## Minimum Rating

The `min` prop sets a minimum required rating value. When set, users cannot select a rating below this value, and the rating will not go below the minimum when cleared. (defaults to `0`)

```svelte /min={1}/
<RatingGroup.Root min={1}>
	{#snippet children({ items })}
		{#each items as item (item.index)}
			<RatingGroup.Item index={item.index}>
				{#if item.state === "active"}⭐{:else}☆{/if}
			</RatingGroup.Item>
		{/each}
	{/snippet}
</RatingGroup.Root>
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<RatingGroupDemoCustom min={1} />
</DemoContainer>

This is useful for scenarios where you require at least a certain rating, such as feedback forms that must have a minimum 1-star rating.

## Accessibility

The `RatingGroup` component is designed to be accessible and follows best practices for keyboard navigation and screen reader support.

### Keyboard Interactions

The `RatingGroup` supports rich keyboard interactions for accessibility and ease of use:

#### Number Input

You can type numbers to directly set the rating value:

-   Type `3` to set rating to 3
-   Type `2.5` to set rating to 2.5 (when `allowHalf` is enabled)
-   Type `0` to clear the rating (if no minimum is set or `min` is `0`)

#### Arrow Key Navigation

-   `ArrowUp` / `ArrowRight` - Increase rating by 1. When `allowHalf` is enabled, by 0.5. (Reversed for RTL)
-   `ArrowDown` / `ArrowLeft` - Decrease rating by 1. When `allowHalf` is enabled, by 0.5. (Reversed for RTL)

#### Other Keys

-   `Home` - Set to minimum rating (or 1 if no minimum)
-   `End` - Set to maximum rating
-   `Space` / `Enter` - Activate the currently focused rating
-   `Escape` - Clear focus and reset to original value

<APISection {schemas} />
