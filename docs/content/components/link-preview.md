---
title: Link Preview
description: Displays a summarized preview of a linked content's details or information.
---

<script>
	import { APISection, ComponentPreviewV2, LinkPreviewDemo, LinkPreviewDemoTransition, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="link-preview-demo" componentName="LinkPreview">

{#snippet preview()}
<LinkPreviewDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

A component that lets users preview a link before they decide to follow it. This is useful for providing non-essential context or additional information about a link without having to navigate away from the current page.

<Callout type="warning" title="A note about mobile devices!">

This component is only intended to be used with a mouse or other pointing device. It doesn't respond to touch events, and the preview content cannot be accessed via the keyboard. On touch devices, the link will be followed immediately. As it is not accessible to all users, the preview should not contain vital information.

</Callout>

## Structure

```svelte
<script lang="ts">
  import { LinkPreview } from "bits-ui";
</script>

<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.Content />
</LinkPreview.Root>
```

## Managing Open State

This section covers how to manage the `open` state of the component.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { LinkPreview } from "bits-ui";
  let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Link Preview</button>

<LinkPreview.Root bind:open={isOpen}>
  <!-- ... -->
</LinkPreview.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { LinkPreview } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<LinkPreview.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</LinkPreview.Root>
```

## Opt-out of Floating UI

When you use the `LinkPreview.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `LinkPreview.ContentStatic` component. This component does not use Floating UI and leaves positioning the content entirely up to you.

```svelte /LinkPreview.ContentStatic/
<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.ContentStatic>
    <!-- ... -->
  </LinkPreview.ContentStatic>
</LinkPreview.Root>
```

<Callout type="warning" title="Heads up!" class="mt-6">

The `LinkPreview.Arrow` component is designed to be used with Floating UI and `LinkPreview.Content`, so you may experience unexpected behavior if you attempt to use it with `LinkPreview.ContentStatic`.

</Callout>

## Custom Anchor

By default, the `LinkPreview.Content` is anchored to the `LinkPreview.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector `string` or an `HTMLElement` to the `customAnchor` prop of the `LinkPreview.Content` component.

```svelte
<script lang="ts">
  import { LinkPreview } from "bits-ui";
  let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<LinkPreview.Root>
  <LinkPreview.Trigger />
  <LinkPreview.Content {customAnchor}>
    <!-- ... -->
  </LinkPreview.Content>
</LinkPreview.Root>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `LinkPreview.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
  import { LinkPreview } from "bits-ui";
  import { fly } from "svelte/transition";
</script>

<LinkPreview.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- ... -->
        </div>
      </div>
    {/if}
  {/snippet}
</LinkPreview.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="link-preview-demo-transition" componentName="LinkPreview" containerClass="mt-4">

{#snippet preview()}
<LinkPreviewDemoTransition />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
