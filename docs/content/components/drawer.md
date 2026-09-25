---
title: Drawer
description: A swipeable panel that slides in from the edge of the viewport.
---

<script>
	import {
		APISection,
		Callout,
		ComponentPreview,
		DrawerDemo,
		DrawerDemoIndentProvider,
		DrawerDemoMobileNav,
		DrawerDemoNested,
		DrawerDemoNonModal,
		DrawerDemoPosition,
		DrawerDemoSnapPoints,
		DrawerDemoSwipeArea,
		DrawerDemoTether,
		DrawerDemoUncontained
	} from "$lib/components/index.js";
	let { schemas } = $props();
</script>

<ComponentPreview name="drawer-demo" componentName="Drawer" variant="preview">

{#snippet preview()}
<DrawerDemo />
{/snippet}

</ComponentPreview>

## Overview

The Drawer component provides an accessible, gesture-driven sheet that slides in from a screen edge. It shares layering and focus primitives with Dialog, but splits presentation into `Drawer.Viewport` and `Drawer.Popup` for swipe handling, snap points, nested stacks, and optional provider-level indent effects.

Derived from [Base UI's Drawer](https://base-ui.com/react/components/drawer) component, adapted for Bits UI and Svelte.

## Key Features

- **Compound structure**: Primitives compose the same way as other Bits UI components, with clear roles for viewport, popup, and portal layers.
- **Gestures & snap points**: Drag-to-dismiss, swipe-to-open via `Drawer.SwipeArea`, and configurable `snapPoints`.
- **Detached triggers**: `Drawer.createTether()` connect triggers and payload to a distant `Drawer.Root`.
- **Accessibility**: Focus scope, scroll lock, and ARIA live on `Drawer.Popup`; keyboard and screen reader patterns align with dialog-style overlays.
- **Provider indent**: `Drawer.Provider`, `Drawer.IndentBackground`, and `Drawer.Indent` coordinate app-wide motion when sheets open.
- **Flexible state**: Controlled and uncontrolled `open`, optional `bind:snapPoint`, and programmatic open/close through a tether.

## Architecture

The Drawer is composed of several sub-components:

- **Provider** _(optional)_: Shares indent/background state for descendant drawers.
- **IndentBackground** / **Indent** _(optional)_: Layers that react while provider-scoped drawers are active.
- **Root**: Owns open state, swipe direction, snap points, tether/trigger id, and children snippet payload.
- **Trigger**: Opens the drawer; can pair with a `tether` for detached roots.
- **SwipeArea**: Edge hit-area to open the drawer with a swipe.
- **Portal**: Renders backdrop and viewport outside the inline tree.
- **Backdrop**: Dimmed layer behind the sheet.
- **Viewport**: Positioning container that participates in drag gestures and exposes `--drawer-keyboard-inset` for keyboard-aware layout adjustments.
- **Popup**: Focus trap, scroll lock, escape/outside dismissal - modal behavior is configured here.
- **Content** / **Title** / **Description** / **Close**: Semantic and interactive pieces inside the popup.

## Structure

```svelte
<script lang="ts">
  import { Drawer } from "bits-ui";
</script>

<Drawer.Provider>
  <Drawer.IndentBackground />
  <Drawer.Indent>
    <Drawer.Root>
      <Drawer.Trigger />
      <Drawer.SwipeArea />
      <Drawer.Portal>
        <Drawer.Backdrop />
        <Drawer.Viewport>
          <Drawer.Popup>
            <Drawer.Content>
              <Drawer.Title />
              <Drawer.Description />
              <Drawer.Close />
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  </Drawer.Indent>
</Drawer.Provider>
```

For drawers that do not need indent effects, you can omit `Provider`, `IndentBackground`, and `Indent`.

## Managing Open State

### Two-Way Binding

Use `bind:open` for simple synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { Drawer } from "bits-ui";
  let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open drawer</button>

<Drawer.Root bind:open={isOpen}>
  <!-- ... -->
</Drawer.Root>
```

### Fully Controlled

Use a [function binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to own reads and writes:

```svelte
<script lang="ts">
  import { Drawer } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<Drawer.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</Drawer.Root>
```

## Managing Snap Points State

When `snapPoints` is set on **`Drawer.Root`**, the active snap is controlled with `snapPoint` / `bind:snapPoint`.

### Two-Way Binding

Use `bind:snapPoint` alongside `snapPoints`:

```svelte {4,10}
<script lang="ts">
  import { Drawer } from "bits-ui";
  const snapPoints = ["160px", 1];
  let snapPoint = $state<string | number | null>(snapPoints[0]);
</script>

<Drawer.Root bind:snapPoint {snapPoints}>
  <!-- ... -->
</Drawer.Root>
```

### Fully Controlled

Use a [function binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for `snapPoint` the same way as `open`:

```svelte
<script lang="ts">
  import { Drawer } from "bits-ui";
  const snapPoints = ["160px", 1];
  let mySnapPoint = $state<string | number | null>(snapPoints[0]);

  function getSnapPoint() {
    return mySnapPoint;
  }

  function setSnapPoint(next: string | number | null | undefined) {
    mySnapPoint = next ?? null;
  }
</script>

<Drawer.Root bind:snapPoint={getSnapPoint, setSnapPoint} {snapPoints}>
  <!-- ... -->
</Drawer.Root>
```

## Focus Management

Focus behavior is configured on **`Drawer.Popup`** (not on Root).

### Focus Trap

By default `trapFocus` is `true`, so keyboard focus stays inside the sheet while it is open.

#### Disabling the Focus Trap

```svelte /trapFocus={false}/
<Drawer.Popup trapFocus={false}>
  <!-- ... -->
</Drawer.Popup>
```

<Callout type="warning" title="Accessibility warning">

Disabling the focus trap can hurt accessibility unless you provide another focus strategy.

</Callout>

### Open Focus

Focus moves into the popup on open. Target a specific control with `onOpenAutoFocus` on **`Drawer.Popup`**:

```svelte {12-15}
<script lang="ts">
  import { Drawer } from "bits-ui";
  let nameInput = $state<HTMLInputElement>();
</script>

<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Backdrop />
    <Drawer.Viewport>
      <Drawer.Popup
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          nameInput?.focus();
        }}
      >
        <Drawer.Content>
          <input type="text" bind:this={nameInput} />
        </Drawer.Content>
      </Drawer.Popup>
    </Drawer.Viewport>
  </Drawer.Portal>
</Drawer.Root>
```

<Callout type="warning" title="Important">

Ensure something in the sheet receives focus when it opens.

</Callout>

### Close Focus

On close, focus returns to the opening trigger by default. Customize with `onCloseAutoFocus` on **`Drawer.Popup`**.

### Modal Semantics and Scroll Lock

`trapFocus` and `preventScroll` default to `true`. The popup sets `aria-modal` only when **both** are `true`. For a non-modal sheet, set one or both to `false` on **`Drawer.Popup`** (see [Non-Modal](#non-modal)). To trap focus without locking document scroll, use `preventScroll={false}`.

## Tether

`tether` is a shared connection object that lets `Drawer.Trigger` and `Drawer.Root` communicate even when they are not in the same component subtree.

Without a tether, each root/trigger pair is local. A tether fixes that by sharing a **trigger registry**: each tethered trigger registers its `id`, DOM node, `payload`, and `disabled` state. Imperative `tether.open(triggerId)` resolves the payload from that registry. Use `Drawer.createTether()` to create the tether.

`bind:triggerId` on `Drawer.Root` stays in sync with the active trigger id.

### Detached triggers

Use a shared tether when controls and the sheet root live in different regions (for example, action rows in a dashboard and one drawer host near the layout root):

```svelte
<script lang="ts">
  import { Drawer } from "bits-ui";

  const queueTether = Drawer.createTether<{
    title: string;
    description: string;
  }>();
</script>

<Drawer.Trigger
  tether={queueTether}
  payload={{
    title: "Export CSV",
    description: "Includes visible columns and filters applied to this view.",
  }}
>
  Export
</Drawer.Trigger>

<Drawer.Root tether={queueTether} swipeDirection="down">
  {#snippet children({ payload, triggerId })}
    <Drawer.Portal>
      <Drawer.Backdrop />
      <Drawer.Viewport>
        <Drawer.Popup>
          <Drawer.Content>
            <Drawer.Title>{payload?.title}</Drawer.Title>
            <Drawer.Description>{payload?.description}</Drawer.Description>
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  {/snippet}
</Drawer.Root>
```

<ComponentPreview name="drawer-demo-tether" componentName="Drawer Detached Triggers" containerClass="mt-4">

{#snippet preview()}
<DrawerDemoTether />
{/snippet}

</ComponentPreview>

### Imperative open and `openWithPayload`

- `tether.open("some-trigger-id")` opens the drawer if that id is registered on the tether (typically via a `Drawer.Trigger` with the same `id`).
- `tether.openWithPayload(payload)` opens without a registered trigger id (snippet `triggerId` can be `null`; payload still flows through `tetherPayload` for that path).
- `tether.close()` closes the bound root.

## Advanced Behaviors

### Scroll Lock

By default `preventScroll` on **`Drawer.Popup`** locks document scroll while open.

```svelte /preventScroll={false}/
<Drawer.Popup preventScroll={false}>
  <!-- ... -->
</Drawer.Popup>
```

<Callout type="warning" title="Note">

Allowing body scroll can affect focus and perceived modality; use intentionally.

</Callout>

### iOS Keyboard Inset

`Drawer.Viewport` exposes `--drawer-keyboard-inset` so you can handle keyboard padding in your own styles.

A common pattern is adding bottom padding to the viewport:

```svelte
<Drawer.Viewport class="[padding-bottom:var(--drawer-keyboard-inset)]">
  <Drawer.Popup>
    <!-- content -->
  </Drawer.Popup>
</Drawer.Viewport>
```

For side drawers that already use a shared `--viewport-padding`, combine them:

```svelte
<Drawer.Viewport
  class="p-[var(--viewport-padding)] [padding-bottom:calc(var(--viewport-padding)+var(--drawer-keyboard-inset))]"
>
  <!-- ... -->
</Drawer.Viewport>
```

### Escape Key Handling

`Drawer.Popup` supports the same escape-layer API as `Dialog.Content`.

#### `escapeKeydownBehavior`

- `'close'` (default), `'ignore'`, `'defer-otherwise-close'`, `'defer-otherwise-ignore'`.

```svelte /escapeKeydownBehavior="ignore"/
<Drawer.Popup escapeKeydownBehavior="ignore">
  <!-- ... -->
</Drawer.Popup>
```

#### `onEscapeKeydown`

```svelte {2-5}
<Drawer.Popup
  onEscapeKeydown={(e) => {
    e.preventDefault();
  }}
>
  <!-- ... -->
</Drawer.Popup>
```

### Interaction Outside

Outside interactions use the dismissible-layer API on **`Drawer.Popup`**.

#### `interactOutsideBehavior`

Same values as Dialog (`'close'`, `'ignore'`, defer variants). Example:

```svelte /interactOutsideBehavior="ignore"/
<Drawer.Popup interactOutsideBehavior="ignore">
  <!-- ... -->
</Drawer.Popup>
```

#### `onInteractOutside`

```svelte {2-5}
<Drawer.Popup
  onInteractOutside={(e) => {
    e.preventDefault();
  }}
>
  <!-- ... -->
</Drawer.Popup>
```

## Position

The `swipeDirection` prop on `Drawer.Root` controls which edge the drawer slides from and which gesture dismisses it. The default is `"down"` (bottom sheet). Set it to `"right"` for a right-edge drawer, `"left"` for a left-edge drawer, or `"up"` for a top-edge drawer.

The component automatically adjusts its CSS variables based on direction - horizontal drawers use `--drawer-swipe-movement-x` and `--drawer-transition-slide-x` for transforms, while vertical drawers use the `-y` variants. The `data-swipe-direction` attribute on the popup reflects the active direction, which is useful for applying direction-specific styles.

```svelte /swipeDirection="bottom"/
<Drawer.Root swipeDirection="bottom">
  <!-- slides in from the bottom edge, dismissed by swiping down -->
</Drawer.Root>
```

<ComponentPreview name="drawer-demo-position" componentName="Drawer" size="xs">

{#snippet preview()}
<DrawerDemoPosition />
{/snippet}

</ComponentPreview>

## Snap Points

The `snapPoints` prop on `Drawer.Root` accepts an array of heights the drawer can settle at. Values from `0` to `1` represent viewport fractions, values greater than `1` are raw pixels, and strings support `px` or `rem` units. The last value in the array is typically `1` (full viewport height).

When snap points are active, the popup's `--drawer-snap-point-offset` CSS variable reflects the current snap offset - use it in your `transform` to position the sheet. The `data-expanded` attribute is present on the popup when the drawer is at the fully expanded snap point (value `1`).

Use `bind:snapPoint` or `defaultSnapPoint` to control or initialize the active snap. Set `snapToSequentialPoints` to `true` to prevent velocity-based skipping, so swipes advance one snap at a time.

<Callout>

Snap points are currently supported for vertical drawers (`swipeDirection` of `"down"` or `"up"`) only.

</Callout>

<ComponentPreview name="drawer-demo-snap-points" componentName="Drawer" size="xs">

{#snippet preview()}
<DrawerDemoSnapPoints />
{/snippet}

</ComponentPreview>

## Nested Drawers

Drawers can be nested by placing a `Drawer.Root` inside another drawer's content. The parent drawer automatically tracks the nesting - it disables its own swipe gestures while a child is open, adjusts heights, and propagates swipe progress up the stack.

Use the data attributes and CSS variables on `Drawer.Popup` and `Drawer.Backdrop` to style the stacking behavior. `data-nested-drawer-open` is present while a child drawer is open (use it to dim or hide parent chrome), while `data-nested-drawer-stacked` stays present through the child's exit transition (use it for height/transform stacking). `Drawer.Viewport` also gets `data-nested` when it belongs to a nested drawer. The `--nested-drawers` CSS variable gives you the count of open nested drawers, and `--drawer-height` / `--drawer-frontmost-height` provide measured heights for stacking math.

The demo below shows a card-stack pattern where parent popups scale down as children open, using `--nested-drawers` to compute the scale factor and `--drawer-frontmost-height` for peek offsets.

<ComponentPreview name="drawer-demo-nested" componentName="Drawer" size="xs">

{#snippet preview()}
<DrawerDemoNested />
{/snippet}

</ComponentPreview>

## Indent Effect

The indent effect pushes your app content back and rounds its corners when a drawer opens, creating a "dynamic island" feel. It requires three components:

- **`Drawer.Provider`** - Wraps your layout and coordinates state across descendant drawers.
- **`Drawer.IndentBackground`** - A background layer behind the indented content (typically full-screen with a solid color or gradient).
- **`Drawer.Indent`** - Wraps the content that should visually respond. This element receives `data-active` / `data-inactive` attributes and exposes `--drawer-swipe-progress` and `--drawer-frontmost-height` as CSS variables, which you can use to drive `scale`, `translateY`, and `border-radius` transitions.

The demo below uses `data-active` to apply a scale/translate transform and rounded top corners on the indent wrapper, with `--drawer-swipe-progress` interpolating back to the resting state during swipe dismiss.

<ComponentPreview name="drawer-demo-indent-provider" componentName="Drawer" size="sm">

{#snippet preview()}
<DrawerDemoIndentProvider />
{/snippet}

</ComponentPreview>

## Non-Modal

For drawers that shouldn't block interaction with the rest of the page, combine three props on `Drawer.Popup`: `trapFocus={false}`, `preventScroll={false}`, and `onInteractOutside` with `e.preventDefault()` to prevent outside clicks from closing the drawer. You'll also typically omit `Drawer.Backdrop` so the page stays visually accessible.

When both `trapFocus` and `preventScroll` are `false`, the popup no longer sets `aria-modal`, making it a non-modal overlay. Users can still dismiss by swiping or clicking the close button.

The demo uses `pointer-events-none` on the viewport and `pointer-events-auto` on the popup so that only the drawer surface captures interactions while the rest of the page remains interactive.

<ComponentPreview name="drawer-demo-non-modal" componentName="Drawer" size="xs">

{#snippet preview()}
<DrawerDemoNonModal />
{/snippet}

</ComponentPreview>

## Mobile Navigation

A full-height bottom sheet works well for mobile navigation menus. The pattern uses a default `swipeDirection` of `"down"` with the popup stretching to fill the viewport height. Scrollable content inside the drawer works naturally - the swipe-to-dismiss gesture only activates when the content is scrolled to the top.

The demo below integrates a `ScrollArea` for the navigation list and uses a longer transition duration for a more deliberate open animation.

<ComponentPreview name="drawer-demo-mobile-nav" componentName="Drawer" size="xs">

{#snippet preview()}
<DrawerDemoMobileNav />
{/snippet}

</ComponentPreview>

## Swipe To Open

`Drawer.SwipeArea` provides an invisible edge hit-area that opens the drawer with a drag gesture. Position it along the edge the drawer slides from (for example, a thin strip on the right edge for a `swipeDirection="right"` drawer). The user swipes in the **opposite** direction of `swipeDirection` to open - so a right-dismissing drawer opens with a left-to-right swipe on the area.

The swipe area accepts an optional `swipeDirection` prop to override the root's direction, and exposes `data-swiping` and `data-disabled` attributes for styling. During the swipe, the popup's `--drawer-swipe-movement-*` CSS variables update in real time so the sheet tracks the user's finger.

<ComponentPreview name="drawer-demo-swipe-area" componentName="Drawer" size="sm">

{#snippet preview()}
<DrawerDemoSwipeArea />
{/snippet}

</ComponentPreview>

## Action Sheet

The action sheet pattern uses a composition technique where the `Drawer.Popup` is set to `pointer-events-none` while individual surfaces inside it use `pointer-events-auto`. This allows gaps between visual cards (like the space between the action list and the cancel button) to pass through clicks to the backdrop, dismissing the drawer.

<ComponentPreview name="drawer-demo-uncontained" componentName="Drawer" size="sm">

{#snippet preview()}
<DrawerDemoUncontained />
{/snippet}

</ComponentPreview>

## Svelte Transitions

Use `forceMount` with the `child` snippet on **`Drawer.Backdrop`** and **`Drawer.Popup`** (and on **`Drawer.Viewport`** when needed) to pair open state with Svelte transitions, matching the `Dialog.Overlay` / `Dialog.Content` pattern.

```svelte /forceMount/ /transition:fade/
<script lang="ts">
  import { Drawer } from "bits-ui";
  import { fade } from "svelte/transition";
</script>

<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Backdrop forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div {...props} transition:fade />
        {/if}
      {/snippet}
    </Drawer.Backdrop>
    <Drawer.Viewport>
      <Drawer.Popup forceMount>
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:fade>
              <!-- ... -->
            </div>
          {/if}
        {/snippet}
      </Drawer.Popup>
    </Drawer.Viewport>
  </Drawer.Portal>
</Drawer.Root>
```

## Working with Forms

If a drawer sits **inside** a form and its **`Drawer.Portal`** lifts content outside the form DOM, native form submission may not include controls inside the portaled sheet. Disable the portal or restructure so submit actions run programmatically, matching the guidance for `Dialog.Portal`.

## Accessibility

Bits UI drawers follow the same dialog-role patterns where applicable: label via **`Drawer.Title`**, describe with **`Drawer.Description`**, and keep **`Drawer.Popup`** focus/scroll settings consistent with your modality requirements (see [Focus Management](#focus-management) above).

<APISection {schemas} />
