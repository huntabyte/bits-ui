---
title: Alert Dialog
description: A modal window that alerts users with important information and awaits their acknowledgment or action.
---

<script>
	import { APISection, ComponentPreviewV2, AlertDialogDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="alert-dialog-demo" comp="Alert Dialog">

{#snippet preview()}
<AlertDialogDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { AlertDialog } from "bits-ui";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger />
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content>
			<AlertDialog.Title />
			<AlertDialog.Description />
			<AlertDialog.Cancel />
			<AlertDialog.Action />
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
```

## Reusable Components

Bits UI provides a decent number of components to construct an Alert Dialog. The idea is to provide a set of building blocks that can be used to create a variety of different components. It's recommended to use these components to build your own reusable Alert Dialog components that can be used throughout your application.

The following example shows at a high level how you might create a reusable Alert Dialog component. We've mixed and matched string props and snippets to demonstrate the flexibility of the component API. Use whatever makes sense for you.

This example is used in a few places throughout this documentation page to give you a better idea of how it's used.

```svelte title="MyAlertDialog.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { AlertDialog, type WithoutChild } from "bits-ui";

	type Props = AlertDialog.RootProps & {
		buttonText: string;
		title: Snippet;
		description: Snippet;
		contentProps?: WithoutChild<AlertDialog.ContentProps>;
		// ...other component props if you wish to pass them
	};

	let {
		open = $bindable(false),
		children,
		buttonText,
		contentProps,
		title,
		description,
		...restProps
	}: Props = $props();
</script>

<AlertDialog.Root bind:open {...restProps}>
	<AlertDialog.Trigger>
		{buttonText}
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content {...contentProps}>
			<AlertDialog.Title>
				{@render title()}
			</AlertDialog.Title>
			<AlertDialog.Description>
				{@render description()}
			</AlertDialog.Description>
			{@render children?.()}
			<AlertDialog.Cancel>Cancel</AlertDialog.Close>
			<AlertDialog.Action>Confirm</AlertDialog.Close>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
```

You can then use the `MyAlertDialog` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
	import MyAlertDialog from "$lib/components/MyAlertDialog.svelte";
</script>

<MyAlertDialog buttonText="Open Dialog">
	{#snippet title()}
		Delete your account
	{/snippet}
	{#snippet description()}
		This action cannot be undone.
	{/snippet}
</MyAlertDialog>
```

Alternatively, you can define the snippets separately and pass them as props to the component:

```svelte title="+page.svelte"
<script lang="ts">
	import MyAlertDialog from "$lib/components/MyAlertDialog.svelte";
</script>

{#snippet title()}
	Delete your account
{/snippet}
{#snippet description()}
	This action cannot be undone.
{/snippet}

<MyAlertDialog buttonText="Open Dialog" {title} {description}>
	<!-- ... additional content here -->
</MyAlertDialog>
```

## Managing Open State

Bits UI provides flexible options for controlling and synchronizing the Alert Dialog's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the dialog's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let isOpen = $state(false);
</script>

<button on:click={() => (isOpen = true)}>Open Dialog</button>

<AlertDialog.Root bind:open={isOpen}>
	<!-- ...dialog components -->
</AlertDialog.Root>
```

This setup enables opening the dialog via the custom button and ensures the local `isOpen` state updates when the dialog closes through any means (e.g., escape key).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the dialog's `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the dialog opens or closes.

```svelte {3,7-11}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let isOpen = $state(false);
</script>

<AlertDialog.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</AlertDialog.Root>
```

## Managing Focus

### Focus Trap

By default, when a dialog is opened, focus will be trapped within the Dialog, preventing the user from interacting with the rest of the page. This follows the [WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/examples/alertdialog/) for alert dialogs.

Although it isn't recommended unless absolutely necessary, you can disabled this beahvior by setting the `trapFocus` prop to `false` on the `AlertDialog.Content` component.

```svelte /trapFocus={false}/
<AlertDialog.Content trapFocus={false}>
	<!-- ... -->
</AlertDialog.Content>
```

### Open Focus

By default, when a dialog is opened, focus will be set to the `AlertDialog.Cancel` button if it exists, or the first focusable element within the `AlertDialog.Content`. This ensures that users navigating my keyboard end up somewhere within the Dialog that they can interact with.

You can override this behavior using the `onOpenAutoFocus` prop on the `AlertDialog.Content` component. It's _highly_ recommended that you use this prop to focus _something_ within the Dialog.

You'll first need to cancel the default behavior of focusing the first focusable element by cancelling the event passed to the `onOpenAutoFocus` callback. You can then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
	<AlertDialog.Content
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<input type="text" bind:this={nameInput} />
	</AlertDialog.Content>
</AlertDialog.Root>
```

### Close Focus

By default, when a dialog is closed, focus will be set to the trigger element of the dialog. You can override this behavior using the `onCloseAutoFocus` prop on the `AlertDialog.Content` component.

You'll need to cancel the default behavior of focusing the trigger element by cancelling the event passed to the `onCloseAutoFocus` callback, and then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<input type="text" bind:this={nameInput} />
<AlertDialog.Root>
	<AlertDialog.Trigger>Open AlertDialog</AlertDialog.Trigger>
	<AlertDialog.Content
		onCloseAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<!-- ... -->
	</AlertDialog.Content>
</AlertDialog.Root>
```

## Scroll Lock

By default, when a dialog is opened, scrolling the body will be disabled, which provides a more native experience for users. If you wish to disable this behavior, you can set the `preventScroll` prop to `false` on the `AlertDialog.Content` component.

```svelte /preventScroll={false}/
<AlertDialog.Content preventScroll={false}>
	<!-- ... -->
</AlertDialog.Content>
```

## Escape Keydown

By default, when a dialog is open, pressing the `Escape` key will close the dialog. Bits UI provides a couple ways to override this behavior.

### escapeKeydownBehavior

You can set the `escapeKeydownBehavior` prop to `'ignore'` on the `AlertDialog.Content` component to prevent the dialog from closing when the `Escape` key is pressed.

```svelte /escapeKeydownBehavior="ignore"/
<AlertDialog.Content escapeKeydownBehavior="ignore">
	<!-- ... -->
</AlertDialog.Content>
```

### onEscapeKeydown

You can also override the default behavior by cancelling the event passed to the `onEscapeKeydown` callback on the `AlertDialog.Content` component.

```svelte /onEscapeKeydown={(e) => e.preventDefault()}/
<AlertDialog.Content onEscapeKeydown={(e) => e.preventDefault()}>
	<!-- ... -->
</AlertDialog.Content>
```

## Interact Outside

Unlike the regular [Dialog](/docs/components/dialog), the Alert Dialog does not close when the user interacts outside the content. This is because when using an alert dialog, the user is expected to acknowledge the dialog's content before continuing.

If you wish to override this behavior, Bits UI provides a couple ways to do so.

### interactOutsideBehavior

You can set the `interactOutsideBehavior` prop to `'close'` on the `AlertDialog.Content` component to close the dialog when the user interacts outside the content.

```svelte /interactOutsideBehavior="ignore"/
<Dialog.Content interactOutsideBehavior="ignore">
	<!-- ... -->
</Dialog.Content>
```

### onInteractOutside

If `interactOutsideBehavior` is set to `'close'`, you can intercept the event passed to the `onInteractOutside` callback on the `AlertDialog.Content` component.

If the event is cancelled, the dialog will not close.

```svelte /onInteractOutside={(e) => e.preventDefault()}/
<AlertDialog.Content onInteractOutside={(e) => e.preventDefault()}>
	<!-- ... -->
</AlertDialog.Content>
```

## Nested Dialogs

Dialogs can be nested within each other to create more complex layouts. See the [Dialog](/docs/components/dialog) component for more information on nested dialogs.

## Svelte Transitions

See the [Dialog](/docs/components/dialog) component for more information on Svelte Transitions with dialog components.

## Usage

### Controlled Open

If you want to control or be aware of the `open` state of the dialog from outside of the component, bind to the `open` prop.

```svelte {3,6,8}
<script lang="ts">
	import { AlertDialog } from "bits-ui";
	let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open Dialog</button>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger />
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content>
			<AlertDialog.Title />
			<AlertDialog.Description />
			<AlertDialog.Cancel />
			<AlertDialog.Action />
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
```

<APISection {schemas} />
