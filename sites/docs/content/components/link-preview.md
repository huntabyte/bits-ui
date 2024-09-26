---
title: Link Preview
description: Displays a summarized preview of a linked content's details or information.
---

<script>
	import { APISection, ComponentPreviewV2, LinkPreviewDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="link-preview-demo" comp="LinkPreview">

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

## Open State

Bits UI provides flexible options for controlling and synchronizing the component's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { LinkPreview } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open LinkPreview</button>

<LinkPreview.Root bind:open={isOpen}>
	<!-- LinkPreview content -->
</LinkPreview.Root>
```

This setup enables opening the Link Preview via the custom button and ensures the local `isOpen` state updates when the state changes through any internal means (e.g., escape key).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the Link Preview's `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Link Preview opens or closes.

```svelte {3,7-11}
<script lang="ts">
	import { LinkPreview } from "bits-ui";
	let isOpen = $state(false);
</script>

<LinkPreview.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</LinkPreview.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `open` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you'll rarely need this, it's possible to do so by setting the `controlledOpen` prop to `true`.

You will then be responsible for updating a local state variable that is passed as the `open` prop to the `LinkPreview.Root` component.

```svelte
<script lang="ts">
	import { LinkPreview } from "bits-ui";

	let myOpen = $state(false);
</script>

<LinkPreview.Root controlledOpen open={myOpen} onOpenChange={(o) => (myOpen = o)}>
	<!-- ... -->
</LinkPreview.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

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

<APISection {schemas} />
