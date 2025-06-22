---
title: BitsConfig
description: A global context provider for configuring default props across all Bits UI components.
---

<script>
	import { APISection } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

## Overview

`BitsConfig` is a global context provider that simplifies managing default prop values across all Bits UI components within its scope. Use it to set defaults like portal targets or locales centrally, and avoid the need to pass the same props to every component.

## Key Features

- **Scoped defaults**: Applies defaults only to components within its scope.
- **Inheritance**: Child `BitsConfig` instances inherit parent values and can selectively override them.
- **Fallback resolution**: Automatically resolves values through the hierarchy of configs.

## Basic Usage

Configure default props at the top level:

```svelte
<script lang="ts">
  import { BitsConfig, Dialog, DateField } from "bits-ui";
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
        <!-- DateField will use the default locale -->
        <DateField.Root>
          <!-- ... -->
        </DateField.Root>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
</BitsConfig>
```

## Inheritance & Overrides

Child instances inherit and override parent values:

```svelte
<script lang="ts">
  import { BitsConfig, Dialog, Tooltip } from "bits-ui";
</script>

<div id="main-portal"></div>
<div id="tooltip-portal"></div>

<!-- Root level config -->
<BitsConfig defaultPortalTo="#main-portal" defaultLocale="de">
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
        <Dialog.Content>
          Nested dialog
          <!-- This date field will use the "de" locale -->
          <DateField.Root>
            <!-- ... -->
          </DateField.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </BitsConfig>
</BitsConfig>
```

## Real-world Examples

### Global Defaults

Set app-wide defaults at the root layout:

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

### Theme-specific Configuration

Different portal targets for distinct UI regions:

```svelte
<script lang="ts">
  import { BitsConfig } from "bits-ui";
  import { MyHeader, MySidebar, MyContent } from "$lib/components";
</script>

<div id="header-portals"></div>
<div id="sidebar-portals"></div>
<div id="main-portals"></div>

<header>
  <BitsConfig defaultPortalTo="#header-portals">
    <MyHeader />
  </BitsConfig>
</header>

<aside>
  <BitsConfig defaultPortalTo="#sidebar-portals">
    <MySidebar />
  </BitsConfig>
</aside>

<main>
  <BitsConfig defaultPortalTo="#main-portals">
    <MyContent />
  </BitsConfig>
</main>
```

### Route-specific Locales

Apply specific locales for certain routes:

```svelte title="routes/(admin)/+layout.svelte"
<script lang="ts">
  import { BitsConfig } from "bits-ui";
  let { children } = $props();
</script>

<BitsConfig defaultLocale="en">
  {@render children()}
</BitsConfig>
```

## Component-level Overrides

Individual components can override global defaults:

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

## Value Resolution Order

Bits UI resolves default values in this priority:

1. **Direct Component prop**
2. **Nearest parent BitsConfig**
3. **Inherited from parent BitsConfig(s)**
4. **Built-in component default** (e.g., portals default to `"body"`, locales default to `"en"`)

<APISection {schemas} />
