---
title: Sidebar
description: A composable, responsive container for application navigation and supporting content.
---

<script>
	import { APISection, ComponentPreview, SidebarDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreview name="sidebar-demo" componentName="Sidebar" variant="preview" containerClass="max-w-none">

{#snippet preview()}
<SidebarDemo />
{/snippet}

</ComponentPreview>

## Overview

The Sidebar primitive provides state, responsive behavior, keyboard controls, semantics, and data attributes for building application sidebars. It is intentionally unstyled: use its parts to create a reusable sidebar that belongs to your product and design system.

The component follows a compound structure familiar from shadcn's Sidebar while keeping layout, mobile presentation, styling, and persistence in your control.

## Key Features

- **Desktop and Mobile State**: Independent `open` and `openMobile` values prevent one layout from unexpectedly changing the other.
- **Responsive Context**: Automatically switches to mobile state at a configurable breakpoint, or accepts an explicit `isMobile` value.
- **Keyboard Shortcut**: <kbd>Command</kbd>/<kbd>Control</kbd> + <kbd>B</kbd> toggles the active sidebar by default.
- **Accessible Controls**: `Trigger` and `Rail` expose the active state through `aria-expanded` and reference the sidebar with `aria-controls`.
- **Composable Parts**: Includes containers for headers, content, groups, menus, actions, badges, nested menus, skeletons, and inset content.
- **Styling Hooks**: State and configuration are exposed through data attributes on each relevant part.

## Structure

```svelte
<script lang="ts">
  import { Sidebar } from "bits-ui";
</script>

<Sidebar.Provider>
  <Sidebar.Root>
    <Sidebar.Header />
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel />
        <Sidebar.GroupAction />
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton />
              <Sidebar.MenuAction />
              <Sidebar.MenuBadge />
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer />
    <Sidebar.Rail />
  </Sidebar.Root>

  <Sidebar.Inset>
    <Sidebar.Trigger />
    <!-- page content -->
  </Sidebar.Inset>
</Sidebar.Provider>
```

`Provider` must wrap every sidebar part. Beyond that requirement, parts can be arranged to fit your layout.

## Managing State

`open` controls the desktop sidebar and defaults to `true`. `openMobile` controls the mobile sidebar and defaults to `false`. Both are bindable.

```svelte
<script lang="ts">
  import { Sidebar } from "bits-ui";

  let open = $state(true);
  let openMobile = $state(false);
</script>

<Sidebar.Provider bind:open bind:openMobile>
  <!-- ... -->
</Sidebar.Provider>
```

Use `onOpenChange` and `onOpenMobileChange` when you need to react to changes. Set `disabled` on the provider to prevent all toggling.

### Snippet State

The `Provider` and `Root` children snippets expose the current state and control functions. This is useful for conditional layout or composing a modal mobile sidebar.

```svelte
<Sidebar.Provider>
  {#snippet children({ state, isMobile, openMobile, setOpenMobile, toggle })}
    <p>{state}</p>
    <button onclick={toggle}>Toggle</button>

    {#if isMobile && openMobile}
      <!-- Render the sidebar in your Dialog or Sheet component. -->
      <button onclick={() => setOpenMobile(false)}>Close</button>
    {/if}
  {/snippet}
</Sidebar.Provider>
```

For an accessible modal mobile experience, compose the mobile `Root` with the Bits UI `Dialog` primitive, as shown in the demo. This adds managed focus, Escape handling, and outside-interaction behavior without coupling the Sidebar primitive to a particular presentation.

## Responsive Behavior

When `isMobile` is not provided, the provider watches the viewport and uses mobile state below `mobileBreakpoint` (`768` pixels by default).

```svelte
<Sidebar.Provider mobileBreakpoint={900}>
  <!-- ... -->
</Sidebar.Provider>
```

Pass `isMobile` when your application already has a responsive-state source or when the sidebar lives in a container whose behavior does not match the viewport.

## Collapse Modes and Variants

`Root` exposes configuration as data attributes so your styles can implement the desired layout:

- `collapsible="offcanvas"` hides the sidebar outside the viewport when collapsed.
- `collapsible="icon"` reduces the sidebar to an icon-width rail when collapsed.
- `collapsible="none"` keeps it expanded and disables `Trigger` and `Rail` toggling.
- `variant="sidebar"`, `"floating"`, or `"inset"` describes the visual relationship to the page.
- `side="left"` or `"right"` describes its physical position.

The primitive does not set widths or transitions. This keeps values such as the expanded width, collapsed rail width, and animation curve in your CSS.

```css
[data-sidebar-root] {
  width: 16rem;
  overflow: hidden;
  transition: width 200ms linear;
}

[data-sidebar-root][data-collapsible="icon"][data-state="collapsed"] {
  width: 3rem;
}

@media (prefers-reduced-motion: reduce) {
  [data-sidebar-root] {
    transition: none;
  }
}
```

Keep sidebar content mounted during the width transition. Hide or clip labels with
`data-state` styles instead of conditionally removing them, which avoids a second
layout change while the panel is moving.

## Keyboard Shortcut

The default shortcut is <kbd>Command</kbd>/<kbd>Control</kbd> + <kbd>B</kbd>. Change its key with `keyboardShortcut`, or set it to `null` to disable the shortcut.

```svelte
<Sidebar.Provider keyboardShortcut="s">
  <!-- Command/Control + S -->
</Sidebar.Provider>
```

The shortcut is ignored when Shift or Alt is held, when the event has already been prevented, or when sidebar toggling is disabled.

## Active Menu Items

Use `isActive` on `MenuButton` and `MenuSubButton`. It adds `data-active` and `aria-current="page"`, which you can target in your styles.

```svelte
<Sidebar.MenuButton
  isActive={pathname === "/dashboard"}
  class="data-[active]:bg-accent"
>
  Dashboard
</Sidebar.MenuButton>
```

`MenuButton` also exposes `data-size` and `data-variant`; `MenuAction` exposes `data-show-on-hover`. These attributes describe styling intent without supplying styles.

## Programmatic Access

Call `useSidebar` in a component rendered inside `Provider` to access the same state and controls without passing snippet props through intermediate components.

```svelte title="SidebarStatus.svelte"
<script lang="ts">
  import { Sidebar } from "bits-ui";

  const sidebar = Sidebar.useSidebar();
</script>

<button onclick={sidebar.toggle}>
  Sidebar is {sidebar.state}
</button>
```

## Persistence

State persistence is deliberately left to the application. Bind `open` and store it in a cookie, local storage, or your own state layer when persistence is appropriate. The primitive does not write cookies or access storage on its own.

<APISection {schemas} />
