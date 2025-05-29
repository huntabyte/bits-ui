---
title: BitsConfig
description: A global context provider for configuring default props across all Bits UI components.
---

## Overview

The `BitsConfig` component is a context provider that lets you set default values for common props across all Bits UI components within its scope. It's particularly useful for:

-   Setting consistent portal targets across your app
-   Configuring default locales for internationalization
-   Avoiding repetitive prop passing to multiple components

## Key Features

-   **Inheritance**: Child `BitsConfig` components inherit parent settings and can override specific values
-   **Scoped defaults**: Only affects components within the config scope
-   **Fallback chain**: Resolves values through the entire inheritance chain
-   **Type-safe**: Full TypeScript support for all configuration options

## Props

| Prop              | Type                        | Description                                                           |
| ----------------- | --------------------------- | --------------------------------------------------------------------- |
| `defaultPortalTo` | `string \| Element \| null` | Default portal target for overlay components (modals, tooltips, etc.) |
| `defaultLocale`   | `string`                    | Default locale for internationalization                               |

## Basic Usage

```svelte
<script lang="ts">
	import { BitsConfig, Dialog } from "bits-ui";
</script>

<!-- All components inside will use these defaults -->
<BitsConfig defaultPortalTo="#modal-root" defaultLocale="es">
	<Dialog.Root>
		<Dialog.Trigger>Open Dialog</Dialog.Trigger>
		<Dialog.Portal>
			<!-- This will portal to #modal-root by default -->
			<Dialog.Content>
				<Dialog.Title>Dialog Title</Dialog.Title>
				<Dialog.Description>Dialog content here</Dialog.Description>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</BitsConfig>
```

## Inheritance & Overrides

`BitsConfig` components can be nested, creating an inheritance chain where child configs can override parent settings:

```svelte
<script lang="ts">
	import { BitsConfig, Dialog, Tooltip } from "bits-ui";
</script>

<div id="main-portal"></div>
<div id="tooltip-portal"></div>

<!-- Root level config -->
<BitsConfig defaultPortalTo="#main-portal" defaultLocale="en">
	<!-- This dialog will portal to #main-portal -->
	<Dialog.Root>
		<Dialog.Portal>
			<Dialog.Content>Main dialog</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

	<!-- Child config overrides portal target, inherits locale -->
	<BitsConfig defaultPortalTo="#tooltip-portal">
		<!-- This tooltip will portal to #tooltip-portal -->
		<Tooltip.Root>
			<Tooltip.Trigger>Hover me</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content>Tooltip content</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>

		<!-- This dialog will also portal to #tooltip-portal -->
		<Dialog.Root>
			<Dialog.Portal>
				<Dialog.Content>Nested dialog</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	</BitsConfig>
</BitsConfig>
```

## Real-world Examples

### App-wide Configuration

Set up consistent defaults at your app root:

```svelte title="+layout.svelte"
<script lang="ts">
	import { BitsConfig } from "bits-ui";
	import { locale } from "$lib/states/i18n.svelte.js";

	let { children } = $props();
</script>

<BitsConfig defaultPortalTo="body" defaultLocale={locale.current}>
	{@render children()}
</BitsConfig>
```

### Theme-specific Portal Targets

Different portal containers for different UI sections:

```svelte
<script lang="ts">
	import { BitsConfig, Dialog, Popover, Menubar } from "bits-ui";
	import { MyHeader, MySidebar, MyContent } from "$lib/components/index.js";
</script>

<div id="header-portals"></div>
<div id="sidebar-portals"></div>
<div id="main-portals"></div>

<header>
	<BitsConfig defaultPortalTo="#header-portals">
		<!-- Any header portals will default to the header container -->
		<MyHeader />
	</BitsConfig>
</header>

<aside>
	<BitsConfig defaultPortalTo="#sidebar-portals">
		<!-- Sidebar tooltips would portal to sidebar container -->
		<MySidebar />
	</BitsConfig>
</aside>

<main>
	<BitsConfig defaultPortalTo="#main-portals">
		<!-- Main content modals portal to main container -->
		<MyContent />
	</BitsConfig>
</main>
```

### Per-route Locale Configuration

Override locale for specific routes:

```svelte title="routes/(admin)/+layout.svelte"
<script lang="ts">
	import { BitsConfig } from "bits-ui";
	let { children } = $props();
</script>

<!-- Admin section always uses English -->
<BitsConfig defaultLocale="en">
	{@render children()}
</BitsConfig>
```

## Component Override

Individual components can still override the config defaults:

```svelte
<script lang="ts">
	import { BitsConfig, Dialog } from "bits-ui";
</script>

<BitsConfig defaultPortalTo="#main-portal">
	<!-- This dialog will use the config default -->
	<Dialog.Root>
		<Dialog.Portal>
			<Dialog.Content>Uses #main-portal</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>

	<!-- This dialog overrides the config -->
	<Dialog.Root>
		<Dialog.Portal to="#special-portal">
			<Dialog.Content>Uses #special-portal</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</BitsConfig>
```

## Resolution Priority

Values are resolved in this order:

1. **Component prop** - Direct prop on the component
2. **Nearest BitsConfig** - Closest parent config value
3. **Inherited config** - Value from parent configs up the chain
4. **Default fallback** - Built-in component default (`"body"` for portals, `"en"` for locale)
