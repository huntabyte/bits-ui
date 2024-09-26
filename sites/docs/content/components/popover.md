---
title: Popover
description: Display supplementary content or information when users interact with specific elements.
---

<script>
	import { APISection, ComponentPreviewV2, PopoverDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="popover-demo" comp="Popover">

{#snippet preview()}
<PopoverDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Popover } from "bits-ui";
</script>

<Popover.Root>
	<Popover.Trigger />
	<Popover.Content>
		<Popover.Close />
		<Popover.Arrow />
	</Popover.Content>
</Popover.Root>
```

## Open State

Bits UI provides flexible options for controlling and synchronizing the Popover's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the Popover's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Popover } from "bits-ui";
	let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Popover</button>

<Popover.Root bind:open={isOpen}>
	<!-- ... -->
</Popover.Root>
```

This setup enables opening the `Popover` via the custom button and ensures the local `isOpen` state updates when the Dialog closes through any means (e.g., escape key).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the `Popover`'s `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the `Popover` opens or closes.

```svelte {3,7-11}
<script lang="ts">
	import { Popover } from "bits-ui";
	let isOpen = $state(false);
</script>

<Popover.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</Popover.Root>
```

### Controlled

Sometimes, you may want complete control over the `open` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you'll rarely need this, it's possible to do so by setting the `controlledOpen` prop to `true`.

You will then be responsible for updating a local state variable that is passed as the `open` prop to the `Popover.Root` component.

```svelte
<script lang="ts">
	import { Popover } from "bits-ui";

	let myOpen = $state(false);
</script>

<Popover.Root controlledOpen open={myOpen} onOpenChange={(o) => (myOpen = o)}>
	<!-- ... -->
</Popover.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Managing Focus

### Focus Trap

By default, when a Popover is opened, focus will be trapped within that Popover. You can disabled this beahvior by setting the `trapFocus` prop to `false` on the `Popover.Content` component.

```svelte /trapFocus={false}/
<Popover.Content trapFocus={false}>
	<!-- ... -->
</Popover.Content>
```

### Open Focus

By default, when a Popover is opened, focus will be set to the first focusable element with the `Popover.Content`. This ensures that users navigating my keyboard end up somewhere within the Popover that they can interact with.

You can override this behavior using the `onOpenAutoFocus` prop on the `Popover.Content` component. It's _highly_ recommended that you use this prop to focus _something_ within the Popover's content.

You'll first need to cancel the default behavior of focusing the first focusable element by cancelling the event passed to the `onOpenAutoFocus` callback. You can then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { Popover } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<Popover.Root>
	<Popover.Trigger>Open Popover</Popover.Trigger>
	<Popover.Content
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<input type="text" bind:this={nameInput} />
	</Popover.Content>
</Popover.Root>
```

### Close Focus

By default, when a Popover is closed, focus will be set to the trigger element of the Popover. You can override this behavior using the `onCloseAutoFocus` prop on the `Popover.Content` component.

You'll need to cancel the default behavior of focusing the trigger element by cancelling the event passed to the `onCloseAutoFocus` callback, and then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { Popover } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<input type="text" bind:this={nameInput} />
<Popover.Root>
	<Popover.Trigger>Open Popover</Popover.Trigger>
	<Popover.Content
		onCloseAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<!-- ... -->
	</Popover.Content>
</Popover.Root>
```

## Scroll Lock

By default, when a Popover is opened, users can still scroll the body and interact with content outside of the Popover. If you wish to lock the body scroll and prevent users from interacting with content outside of the Popover, you can set the `preventScroll` prop to `true` on the `Popover.Content` component.

```svelte /preventScroll={true}/
<Popover.Content preventScroll={true}>
	<!-- ... -->
</Popover.Content>
```

## Escape Keydown

By default, when a Popover is open, pressing the `Escape` key will close the dialog. Bits UI provides a couple ways to override this behavior.

### escapeKeydownBehavior

You can set the `escapeKeydownBehavior` prop to `'ignore'` on the `Popover.Content` component to prevent the dialog from closing when the `Escape` key is pressed.

```svelte /escapeKeydownBehavior="ignore"/
<Popover.Content escapeKeydownBehavior="ignore">
	<!-- ... -->
</Popover.Content>
```

### onEscapeKeydown

You can also override the default behavior by cancelling the event passed to the `onEscapeKeydown` callback on the `Popover.Content` component.

```svelte /onEscapeKeydown={(e) => e.preventDefault()}/
<Popover.Content onEscapeKeydown={(e) => e.preventDefault()}>
	<!-- ... -->
</Popover.Content>
```

## Interact Outside

By default, when a Popover is open, pointer down events outside the content will close the popover. Bits UI provides a couple ways to override this behavior.

### interactOutsideBehavior

You can set the `interactOutsideBehavior` prop to `'ignore'` on the `Popover.Content` component to prevent the dialog from closing when the user interacts outside the content.

```svelte /interactOutsideBehavior="ignore"/
<Popover.Content interactOutsideBehavior="ignore">
	<!-- ... -->
</Popover.Content>
```

### onInteractOutside

You can also override the default behavior by cancelling the event passed to the `onInteractOutside` callback on the `Popover.Content` component.

```svelte /onInteractOutside={(e) => e.preventDefault()}/
<Popover.Content onInteractOutside={(e) => e.preventDefault()}>
	<!-- ... -->
</Popover.Content>
```

<APISection {schemas} />
