---
title: Dialog
description: A modal window presenting content or seeking user input without navigating away from the current context.
---

<script>
	import { APISection, ComponentPreviewV2, DialogDemo, DialogDemoCustom, DialogDemoNested } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="dialog-demo" comp="Dialog">

{#snippet preview()}
<DialogDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";
</script>

<Dialog.Root>
	<Dialog.Trigger />
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content>
			<Dialog.Title />
			<Dialog.Description />
			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

## Reusable Components

Bits UI provides a decent number of components to construct a Dialog. The idea is to provide a set of building blocks that can be used to create a variety of different layouts. It's recommended to use these components to build your own reusable Dialog components that can be used throughout your application.

The following example shows at a high level how you might create a reusable Dialog component. We've mixed and matched string props and snippets to demonstrate the flexibility of the component API. Use whatever makes sense for you.

```svelte title="MyDialog.svelte"
<script lang="ts">
	import type { Snippet } from "svelte";
	import { Dialog, type WithoutChild } from "bits-ui";

	type Props = Dialog.RootProps & {
		buttonText: string;
		title: Snippet;
		description: Snippet;
		contentProps?: WithoutChild<Dialog.ContentProps>;
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

<Dialog.Root bind:open {...restProps}>
	<Dialog.Trigger>
		{buttonText}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content {...contentProps}>
			<Dialog.Title>
				{@render title()}
			</Dialog.Title>
			<Dialog.Description>
				{@render description()}
			</Dialog.Description>
			{@render children?.()}
			<Dialog.Close>Close Dialog</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
```

You can then use the `MyDialog` component in your application like so:

```svelte
<script lang="ts">
	import MyDialog from "$lib/components/MyDialog.svelte";
</script>

<MyDialog buttonText="Open Dialog">
	{#snippet title()}
		Account settings
	{/snippet}

	{#snippet description()}
		Manage your account settings and preferences.
	{/snippet}

	<!-- Additional dialog content here... -->
</MyDialog>
```

Alternatively, you can define the snippets separately and pass them as props to the component:

```svelte
<script lang="ts">
	import MyDialog from "$lib/components/MyDialog.svelte";
</script>

{#snippet title()}
	Account settings
{/snippet}

{#snippet description()}
	Manage your account settings and preferences.
{/snippet}

<MyDialog buttonText="Open Dialog" {title} {description}>
	<!-- Additional dialog content here... -->
</MyDialog>
```

## Managing Open State

Bits UI provides flexible options for controlling and synchronizing the Dialog's open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the Dialog's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { Dialog } from "bits-ui";
	let isOpen = $state(false);
</script>

<button on:click={() => (isOpen = true)}>Open Dialog</button>

<Dialog.Root bind:open={isOpen}>
	<!-- Dialog content -->
</Dialog.Root>
```

This setup enables opening the Dialog via the custom button and ensures the local `isOpen` state updates when the Dialog closes through any means (e.g., escape key).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the Dialog's `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Dialog opens or closes.

```svelte {3,7-11}
<script lang="ts">
	import { Dialog } from "bits-ui";
	let isOpen = $state(false);
</script>

<Dialog.Root
	open={isOpen}
	onOpenChange={(open) => {
		isOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</Dialog.Root>
```

### Controlled

Sometimes, you may want complete control over the dialog's `open` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you'll rarely need this, it's possible to do so by setting the `controlledOpen` prop to `true`.

You will then be responsible for updating a local state variable that is passed as the `open` prop to the `Dialog.Root` component.

```svelte
<script lang="ts">
	import { Dialog } from "bits-ui";

	let myOpen = $state<string>(false);
</script>

<Dialog.Root controlledOpen open={myOpen} onOpenChange={(o) => (myOpen = o)}>
	<!-- ... -->
</Dialog.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Managing Focus

### Focus Trap

By default, when a Dialog is opened, focus will be trapped within the Dialog, preventing the user from interacting with the rest of the page. This follows the [WAI-ARIA design pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) for modal dialogs.

Although it isn't recommended unless absolutely necessary, you can disabled this beahvior by setting the `trapFocus` prop to `false` on the `Dialog.Content` component.

```svelte /trapFocus={false}/
<Dialog.Content trapFocus={false}>
	<!-- ... -->
</Dialog.Content>
```

### Open Focus

By default, when a Dialog is opened, focus will be set to the first focusable element with the `Dialog.Content`. This ensures that users navigating my keyboard end up somewhere within the Dialog that they can interact with.

You can override this behavior using the `onOpenAutoFocus` prop on the `Dialog.Content` component. It's _highly_ recommended that you use this prop to focus _something_ within the Dialog.

You'll first need to cancel the default behavior of focusing the first focusable element by cancelling the event passed to the `onOpenAutoFocus` callback. You can then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { Dialog } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<Dialog.Root>
	<Dialog.Trigger>Open Dialog</Dialog.Trigger>
	<Dialog.Content
		onOpenAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<input type="text" bind:this={nameInput} />
	</Dialog.Content>
</Dialog.Root>
```

### Close Focus

By default, when a Dialog is closed, focus will be set to the trigger element of the Dialog. You can override this behavior using the `onCloseAutoFocus` prop on the `Dialog.Content` component.

You'll need to cancel the default behavior of focusing the trigger element by cancelling the event passed to the `onCloseAutoFocus` callback, and then focus whatever you wish.

```svelte {9-12}
<script lang="ts">
	import { Dialog } from "bits-ui";
	let nameInput = $state<HTMLInputElement>();
</script>

<input type="text" bind:this={nameInput} />
<Dialog.Root>
	<Dialog.Trigger>Open Dialog</Dialog.Trigger>
	<Dialog.Content
		onCloseAutoFocus={(e) => {
			e.preventDefault();
			nameInput?.focus();
		}}
	>
		<!-- ... -->
	</Dialog.Content>
</Dialog.Root>
```

## Scroll Lock

By default, when a Dialog is opened, scrolling the body will be disabled, which provides a more native experience for users. If you wish to disable this behavior, you can set the `preventScroll` prop to `false` on the `Dialog.Content` component.

```svelte /preventScroll={false}/
<Dialog.Content preventScroll={false}>
	<!-- ... -->
</Dialog.Content>
```

## Escape Keydown

By default, when a Dialog is open, pressing the `Escape` key will close the dialog. Bits UI provides a couple ways to override this behavior.

### escapeKeydownBehavior

You can set the `escapeKeydownBehavior` prop to `'ignore'` on the `Dialog.Content` component to prevent the dialog from closing when the `Escape` key is pressed.

```svelte /escapeKeydownBehavior="ignore"/
<Dialog.Content escapeKeydownBehavior="ignore">
	<!-- ... -->
</Dialog.Content>
```

### onEscapeKeydown

You can also override the default behavior by cancelling the event passed to the `onEscapeKeydown` callback on the `Dialog.Content` component.

```svelte /onEscapeKeydown={(e) => e.preventDefault()}/
<Dialog.Content onEscapeKeydown={(e) => e.preventDefault()}>
	<!-- ... -->
</Dialog.Content>
```

## Interact Outside

By default, when a Dialog is open, pressing the outside the content will close the dialog. Bits UI provides a couple ways to override this behavior.

### interactOutsideBehavior

You can set the `interactOutsideBehavior` prop to `'ignore'` on the `Dialog.Content` component to prevent the dialog from closing when the user interacts outside the content.

```svelte /interactOutsideBehavior="ignore"/
<Dialog.Content interactOutsideBehavior="ignore">
	<!-- ... -->
</Dialog.Content>
```

### onInteractOutside

You can also override the default behavior by cancelling the event passed to the `onInteractOutside` callback on the `Dialog.Content` component.

```svelte /onInteractOutside={(e) => e.preventDefault()}/
<Dialog.Content onInteractOutside={(e) => e.preventDefault()}>
	<!-- ... -->
</Dialog.Content>
```

## Nested Dialogs

Dialogs can be nested within each other to create more complex layouts.

```svelte
<script lang="ts">
	import MyDialog from "$lib/components/MyDialog.svelte";
</script>

<MyDialog buttonText="Open first dialog">
	{#snippet title()}
		First Dialog
	{/snippet}
	{#snippet description()}
		This is the first dialog.
	{/snippet}
	<MyDialog buttonText="Open second dialog">
		{#snippet title()}
			Second Dialog
		{/snippet}
		{#snippet description()}
			This is the second dialog.
		{/snippet}
	</MyDialog>
</MyDialog>
```

<DialogDemoNested />

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Dialog.Content` and `Dialog.Overlay` components to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fade/ /transition:fly/
<script lang="ts">
	import { Dialog } from "bits-ui";
	import { fly, fade } from "svelte/transition";
</script>

<Dialog.Root>
	<!-- ... other dialog components -->
	<Dialog.Overlay forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:fade>
					<!-- ... -->
				</div>
			{/if}
		{/snippet}
	</Dialog.Overlay>
	<Dialog.Content forceMount>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:fly>
					<!-- ... -->
				</div>
			{/if}
		{/snippet}
	</Dialog.Content>
</Dialog.Root>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content and overlay components that handle this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<APISection {schemas} />
