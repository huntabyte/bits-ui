---
title: Styling
description: Learn how to style Bits UI components.
---

We ship almost zero styles with Bits UI. This is intentional, as we want to give you the most flexibility possible when it comes to styling your components.

For each component that renders an HTML element, we provide a `class` prop that you can use to apply styles to the component. This is the recommended and most straightforward way to style them.

## CSS frameworks

If you're using a CSS framework like Tailwind or UnoCSS, you can simply pass the classes you need to the component, and they will be applied to the underlying HTML element it renders.

```svelte
<script lang="ts">
	import { Button } from "bits-ui";
</script>

<Button.Root class="h-12 w-full bg-blue-500 hover:bg-blue-600">
	Click me
</Button.Root>
```

## Data attributes

A data attribute is applied to each element rendered by Bits UI, which you can use to target the component across your entire application. Check out the API reference of the component to determine what those data attributes are.

You can then use those data attributes like so:

#### Define global styles

```css title="src/app.pcss"
[data-button-root] {
	height: 3rem;
	width: 100%;
	background-color: #3182ce;
	color: #fff;
}
```

#### Import stylesheet

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
	import "../app.pcss";
</script>

<slot />
```

Now every `Button.Root` component will have the styles applied to it.

## Global classes

If you prefer the class approach, you can simply apply your global classes to the component.

#### Define global styles

```css title="src/app.pcss"
.button {
	height: 3rem;
	width: 100%;
	background-color: #3182ce;
	color: #fff;
}
```

#### Apply global styles

```svelte title="src/routes/+layout.svelte"
<script lang="ts">
	import "../app.pcss";
</script>

<slot />
```

#### Use with components

```svelte title="Button.svelte"
<script lang="ts">
	import { Button } from "bits-ui";
</script>

<Button.Root class="button">Click me</Button.Root>
```
