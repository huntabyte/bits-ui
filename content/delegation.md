---
title: Render Delegation
description: Learn how to use the asChild prop to render your own elements.
---

## Usage

For certain components, we set a default underlying HTML element to wrap the `<slot/>` with. As a high level example, the `AccordionTrigger`, looks something like this:

```svelte
<button>
	<slot />
</button>
```

While we do allow you to set any attribute that you normally could on a button, let's say you're one of those `<div role="button" />` people and want to use a `div` or some other element instead of the button we provide out of the box. That's when render delegation comes into play.

Each of the components that support render delegation have an optional prop called `asChild`. When set to `true`, the component will pass the `builder` as a slot prop, which you can then apply to the element of your choosing.

Let's take a look at an example using the `AccordionTrigger` component:

```svelte
<AccordionTrigger asChild let:builder>
	<div use:builder.action {...builder}>Open accordion item</div>
</AccordionTrigger>
```

We're passing the Melt UI builder we would normally apply to the `<button>` as a prop which can then be applied to any element we want. Keep in mind, you will need to `use:builder.action`, as well as spread the builder props onto the element you're using to retain all functionality.

So behind the scenes this is what's happening (pseudo):

```svelte
<script lang="ts">
	// other imports/props/logic omitted for brevity
	const trigger = getTrigger();
	export let asChild = false;
</script>

{#if asChild}
	<slot builder={$trigger} />
{:else}
	<button use:trigger.action {...trigger}>
		<slot />
	</button>
{/if}
```

## Use with components

Unfortunately, wanting to delegate rendering to a component isn't as simple as an element, since we can't apply actions directly to components. While still possible, there's some work that has to be done to each component you intend to use render delegation with.

At the time of writing this, we're still working on refined type / helpers functions on the Melt UI side for this exact purpose, but for the time being, we expose a few helper functions and types to make this easier.

Let's create a custom `<Button />` component that could be used with this pattern. This is a simplified version of the [Button](/docs/components/button) component we provide as a part of Bits, but it should give you an idea of how to implement this pattern.

```svelte
<script lang="ts">
	import { builderActions, getAttrs, type Builder } from "bits-ui";
	export let builders: Builder[] = [];
</script>

<button use:builderActions={{ builders }} {...getAttrs(builders)}>
	<slot />
</button>
```

We're using the `builderActions` and `getAttrs` helpers to apply the actions and attributes to the button. We're also using the `Builder` type to type the `builders` prop we'd receive from whatever component we're using this with. We use an array here to cover the case where we may want to apply multiple builders to the button. The helper functions handle applying all the actions and attributes to the button for us.

If you do plan to pass multiple builders, the order in which you pass them matters. Certain actions/attributes may override others, so be sure to test your implementation to ensure it's working as expected.
