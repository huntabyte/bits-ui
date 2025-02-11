---
title: Navigation Menu
description: A list of links that allow users to navigate between pages of a website.
navLabel: New
---

<script>
	import { APISection, ComponentPreviewV2, NavigationMenuDemo, Callout, NavigationMenuDemoForceMount } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="navigation-menu-demo" comp="Navigation Menu">

{#snippet preview()}
<NavigationMenuDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { NavigationMenu } from "bits-ui";
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger />
			<NavigationMenu.Content />
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger />
			<NavigationMenu.Content>
				<NavigationMenu.Link />
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link />
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger />
			<NavigationMenu.Content>
				<NavigationMenu.Sub>
					<NavigationMenu.List />
					<NavigationMenu.Viewport />
				</NavigationMenu.Sub>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Indicator />
	</NavigationMenu.List>
	<NavigationMenu.Viewport />
</NavigationMenu.Root>
```

## Usage

### Vertical

You can create a vertical menu by using the `orientation` prop.

```svelte /orientation="vertical"/
<NavigationMenu.Root orientation="vertical">
	<!-- ... -->
</NavigationMenu.Root>
```

### Flexible Layouts

Use the `Viewport` component when you need extra control over where `Content` is rendered. This can be useful when your design requires an adjusted DOM structure or if you need flexibility to achieve advanced animations. Tab focus will be managed automatically.

```svelte {14}
<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
			<NavigationMenu.Content>Item one content</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
			<NavigationMenu.Content>Item two content</NavigationMenu.Content>
		</NavigationMenu.Item>
	</NavigationMenu.List>

	<!-- NavigationMenu.Content will be rendered here when active  -->
	<NavigationMenu.Viewport />
</NavigationMenu.Root>
```

### With Indicator

You can use the optional `Indicator` component to highlight the currently active `Trigger`, which is useful when you want to provide an animated visual cue such as an arrow or highlight to accompany the `Viewport`.

```svelte {12}
<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
			<NavigationMenu.Content>Item one content</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
			<NavigationMenu.Content>Item two content</NavigationMenu.Content>
		</NavigationMenu.Item>

		<NavigationMenu.Indicator />
	</NavigationMenu.List>

	<NavigationMenu.Viewport />
</NavigationMenu.Root>
```

### Submenus

You can create a submenu by nesting your navigation menu and using the `Navigation.Sub` component in place of `NavigationMenu.Root`.
Submenus work differently than the `Root` menus and are more similar to [Tabs](/docs/components/tabs) in that one item should always be active, so be sure to assign and pass a `value` prop.

```svelte
<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
			<NavigationMenu.Content>Item one content</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<NavigationMenu.Sub value="sub1">
					<NavigationMenu.List>
						<NavigationMenu.Item value="sub1">
							<NavigationMenu.Trigger>Sub item one</NavigationMenu.Trigger>
							<NavigationMenu.Content>Sub item one content</NavigationMenu.Content>
						</NavigationMenu.Item>
						<NavigationMenu.Item value="sub2">
							<NavigationMenu.Trigger>Sub item two</NavigationMenu.Trigger>
							<NavigationMenu.Content>Sub item two content</NavigationMenu.Content>
						</NavigationMenu.Item>
					</NavigationMenu.List>
				</NavigationMenu.Sub>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
```

### Advanced Animation

We expose `--bits-navigation-menu-viewport-[width|height]` and `data-motion['from-start'|'to-start'|'from-end'|'to-end']` to allow you to animate the `NavigationMenu.Viewport` size and `NavigationMenu.Content` position based on the enter/exit direction.

Combining these with `position: absolute;` allows you to create smooth overlapping animation effects when moving between items.

```svelte
<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
			<NavigationMenu.Content class="NavigationMenuContent">
				Item one content
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
			<NavigationMenu.Content class="NavigationMenuContent">
				Item two content
			</NavigationMenu.Content>
		</NavigationMenu.Item>
	</NavigationMenu.List>

	<NavigationMenu.Viewport class="NavigationMenuViewport" />
</NavigationMenu.Root>
```

```css
/* app.css */
.NavigationMenuContent {
	position: absolute;
	top: 0;
	left: 0;
	animation-duration: 250ms;
	animation-timing-function: ease;
}
.NavigationMenuContent[data-motion="from-start"] {
	animation-name: enterFromLeft;
}
.NavigationMenuContent[data-motion="from-end"] {
	animation-name: enterFromRight;
}
.NavigationMenuContent[data-motion="to-start"] {
	animation-name: exitToLeft;
}
.NavigationMenuContent[data-motion="to-end"] {
	animation-name: exitToRight;
}

.NavigationMenuViewport {
	position: relative;
	width: var(--bits-navigation-menu-viewport-width);
	height: var(--bits-navigation-menu-viewport-height);
	transition:
		width,
		height,
		250ms ease;
}

@keyframes enterFromRight {
	from {
		opacity: 0;
		transform: translateX(200px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes enterFromLeft {
	from {
		opacity: 0;
		transform: translateX(-200px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes exitToRight {
	from {
		opacity: 1;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(200px);
	}
}

@keyframes exitToLeft {
	from {
		opacity: 1;
		transform: translateX(0);
	}
	to {
		opacity: 0;
		transform: translateX(-200px);
	}
}
```

### Force Mounting

You may wish for the links in the Navigation Menu to persist in the DOM, regardless of whether the menu is open or not. This is particularly useful for SEO purposes. You can achieve this by using the `forceMount` prop on the `NavigationMenu.Content` and `NavigationMenu.Viewport` components.

<Callout type="warning">

**Note:** Using `forceMount` requires you to manage the visibility of the elements yourself, using the `data-state` attributes on the `NavigationMenu.Content` and `NavigationMenu.Viewport` components.

</Callout>

```svelte /forceMount/
<NavigationMenu.Content forceMount></NavigationMenu.Content>
<NavigationMenu.Viewport forceMount></NavigationMenu.Viewport>
```

<ComponentPreviewV2 name="navigation-menu-demo-force-mount" comp="Navigation Menu">

{#snippet preview()}
<NavigationMenuDemoForceMount />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
