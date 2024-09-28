---
title: Render Delegation
description: Learn how to use the `child` snippet to render your own elements.
---

## Usage

For certain components, we set a default underlying HTML element to wrap the `children` with. As a high level example, the `Accordion.Trigger`, looks something like this:

```svelte
<button>
	{@render children()}
</button>
```

While we do allow you to set any attribute that you normally could on a button, let's say you want to apply a [Svelte Transition](https://svelte.dev/docs#transition) or [Svelte Action](https://svelte.dev/docs#use_action) to the button, or use a custom component you've made, that's when render delegation comes into play.

Each of the components that support render delegation accept an optional prop called `child`, which is a [Snippet](https://svelte.dev). When used, the component will pass the attributes as a snippet prop, which you can then apply to the element of your choosing. Note, if you use `child` any other children that aren't within that `child` snippet will be ignored.

Let's take a look at an example using the `Accordion.Trigger` component:

```svelte
<Accordion.Trigger>
	{#snippet child({ props })}
		<div {...props}>Open accordion item</div>
	{/snippet}
</Accordion.Trigger>
```

We're passing all the props/attributes we would normally apply to the `<button>` within the component to whatever element we want. These props include event handlers, aria attributes, and any other attributes you passed into the `Accordion.Trigger` component.

## Custom IDs & Attributes

If you wish to use a custom ID, event handlers, or other attributes with a custom element, you **_must_** pass them to the component first. A lot of Bits UI internals rely on the ID, and these props are merged via [`mergeProps`](https://github.com/huntabyte/bits-ui/blob/main/packages/bits-ui/src/lib/internal/mergeProps.ts) so you'll need to do something like this:

```svelte
<Accordion.Trigger id="my-custom-id" onclick={() => console.log("clicked")}>
	<!-- your custom ID and event handler is now inside the `props` object -->
	{#snippet child({ props })}
		<div {...props}>Open accordion item</div>
	{/snippet}
</Accordion.Trigger>
```

Behind the scenes this is what's happening (pseudo):

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
