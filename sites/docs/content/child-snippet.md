---
title: Child Snippet
description: Learn how to use the `child` snippet to render your own elements.
---

## Usage

Many Bits UI components have a default HTML element that wraps their `children`. For example, `Accordion.Trigger` typically renders as:

```svelte
<button>
	{@render children()}
</button>
```

While you can set standard button attributes, you might need more control for:

-   Applying Svelte transitions or actions
-   Using custom components
-   Scoped CSS

This is where the `child` snippet comes in.

Components supporting render delegation accept an optional child prop, which is a Svelte snippet. When used, the component passes its attributes to this snippet, allowing you to apply them to any element.

Let's take a look at an example using the `Accordion.Trigger` component:

```svelte
<Accordion.Trigger>
	{#snippet child({ props })}
		<div {...props}>Open accordion item</div>
	{/snippet}
</Accordion.Trigger>
```

The `props` object includes event handlers, ARIA attributes, and any other attributes passed to `Accordion.Trigger`. Note that when using `child`, other children outside this snippet are ignored.

## Custom IDs & Attributes

To use custom IDs, event handlers, or other attributes with a custom element, you must pass them to the component first. This is crucial because:

-   Many Bits UI internals rely on specific IDs
-   Props are merged using a [`mergeProps`](/docs/utilities/merge-props) function to handle cancelling internal handlers, etc.

Correct usage:

```svelte
<Accordion.Trigger id="my-custom-id" onclick={() => console.log("clicked")}>
	<!-- your custom ID and event handler is now inside the `props` object -->
	{#snippet child({ props })}
		<div {...props}>Open accordion item</div>
	{/snippet}
</Accordion.Trigger>
```

In this example, `my-custom-id`, the click event handler, and my-custom-class are properly merged into the `props` object, ensuring they work alongside Bits UI's internal logic.

Behind the scenes, components using the child prop typically implement logic similar to this:

```svelte
<script lang="ts">
	// other imports/props/logic omitted for brevity
	let { child, children, ...restProps } = $props();
	const trigger = makeTrigger();

	const mergedProps = $derived(mergeProps(restProps, trigger.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
```
