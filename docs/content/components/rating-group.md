---
title: Rating Group
description: Allows users to provide ratings using customizable items (like stars).
navLabel: Preview
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

<Callout type="warning">

This component is currently in preview. The API may change before it is considered stable. You will know when it is stable because the component will be exported as `RatingGroup` instead of `unstable_RatingGroup`. Your feedback will be invaluable in shaping the final API.

</Callout>

## Structure

```svelte
<script lang="ts">
  import { unstable_RatingGroup as RatingGroup } from "bits-ui";
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
  import {
    unstable_RatingGroup as RatingGroup,
    type WithoutChildrenOrChild,
  } from "bits-ui";
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
  import { unstable_RatingGroup as RatingGroup } from "bits-ui";
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
  import { unstable_RatingGroup as RatingGroup } from "bits-ui";
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
<RatingGroup.Root min={3} value={3}>
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
	<RatingGroupDemoCustom min={3} value={3} />
</DemoContainer>

This is useful for scenarios where you require at least a certain rating, such as feedback forms that must have a minimum 1-star rating.

## Accessibility

The `RatingGroup` component implements comprehensive accessibility features following WAI-ARIA best practices for rating interfaces.

### ARIA Implementation

The component uses the **slider pattern** rather than a radiogroup pattern, which provides better screen reader support for rating interfaces:

- **Root element**: `role="slider"` with complete ARIA slider attributes
- **Rating items**: `role="presentation"` to avoid redundant announcements
- **Value communication**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for current state
- **Custom descriptions**: `aria-valuetext` for contextual rating descriptions
- **State indicators**: `aria-disabled`, `aria-required`, `aria-orientation`

When users navigate with arrow keys, screen readers announce the new rating value immediately, providing real-time feedback.

### Keyboard Navigation Strategy

The keyboard implementation follows platform conventions while adding rating-specific enhancements:

#### Direct Number Input

The most efficient way to set ratings - users can type the exact rating they want:

- **Integer ratings**: Type `3` to set rating to 3 stars
- **Half ratings**: Type `2.5` to set 2.5 stars (when `allowHalf` is enabled)
- **Clear rating**: Type `0` to remove rating (respects minimum constraints)
- **Input validation**: Invalid numbers are ignored, values are clamped to min/max range

#### Arrow Key Navigation

Navigation adapts to both rating precision and text direction:

- **Standard mode**: Arrow keys increment/decrement by 1
- **Half rating mode**: Arrow keys increment/decrement by 0.5 for finer control
- **RTL support**: Left/right arrows automatically reverse in right-to-left layouts
- **Bounds respect**: Navigation stops at min/max values

#### Quick Navigation

- **`Home`**: Jump to minimum rating (or 1 if no minimum set)
- **`End`**: Jump to maximum rating
- **`PageUp`/`PageDown`**: Increment/decrement by 1 (alternative to arrows)

### Focus Management

The component handles focus intelligently:

- **Mouse interactions**: Clicking a rating item automatically focuses the root slider
- **Keyboard focus**: Single tab stop - the entire rating group acts as one focusable unit
- **Visual feedback**: Focus styling applied to the root container
- **Disabled state**: Component becomes non-focusable when disabled

### Customizing Accessibility

You can enhance the accessibility experience with custom `aria-valuetext`:

```svelte
<RatingGroup.Root
	"aria-valuetext"={(value, max) => {
		if (value === 0) return "No rating selected";
		return `${value} out of ${max} stars. ${value >= 4 ? "Excellent" : value >= 3 ? "Good" : "Fair"} rating.`;
	}}
>
	<!-- ... -->
</RatingGroup.Root>
```

<APISection {schemas} />
