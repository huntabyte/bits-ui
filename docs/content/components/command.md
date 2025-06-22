---
title: Command
description: A command menu component that can be used to search, filter, and select items.
---

<script>
	import { APISection, ComponentPreviewV2, CommandDemo, CommandDemoGrid, CommandDemoDialog, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="command-demo" componentName="Command">

{#snippet preview()}
<CommandDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Command component, also known as a command menu, is designed to provide users with a quick and efficient way to search, filter, and select items within an application. It combines the functionality of a search input with a dynamic, filterable list of commands or options, making it ideal for applications that require fast navigation or action execution.

## Key Features

- **Dynamic Filtering**: As users type in the input field, the list of commands or items is instantly filtered and sorted based on an (overridable) scoring algorithm.
- **Keyboard Navigation**: Full support for keyboard interactions, allowing users to quickly navigate and select items without using a mouse.
- **Grouped Commands**: Ability to organize commands into logical groups, enhancing readability and organization.
- **Empty and Loading States**: Built-in components to handle scenarios where no results are found or when results are being loaded.
- **Accessibility**: Designed with ARIA attributes and keyboard interactions to ensure screen reader compatibility and accessibility standards.

## Architecture

The Command component is composed of several sub-components, each with a specific role:

- **Root**: The main container that manages the overall state and context of the command menu.
- **Input**: The text input field where users can type to search or filter commands.
- **List**: The container for the list of commands or items.
- **Viewport**: The visible area of the command list, which applies CSS variables to handle dynamic resizing/animations based on the height of the list.
- **Empty**: A component to display when no results are found.
- **Loading**: A component to display while results are being fetched or processed.
- **Group**: A container for a group of items within the command menu.
- **GroupHeading**: A header element to provide an accessible label for a group of items.
- **GroupItems**: A container for the items within a group.
- **Item**: Individual selectable command or item.
- **LinkItem**: A variant of `Command.Item` specifically for link-based actions.
- **Separator**: A visual separator to divide different sections of the command list.

## Structure

Here's an overview of how the Command component is structured in code:

```svelte
<script lang="ts">
  import { Command } from "bits-ui";
</script>

<Command.Root>
  <Command.Input />
  <Command.List>
    <Command.Viewport>
      <Command.Empty />
      <Command.Loading />
      <Command.Group>
        <Command.GroupHeading />
        <Command.GroupItems>
          <Command.Item />
          <Command.LinkItem />
        </Command.GroupItems>
      </Command.Group>
      <Command.Separator />
      <Command.Item />
      <Command.LinkItem />
    </Command.Viewport>
  </Command.List>
</Command.Root>
```

## Managing Value State

Bits UI offers several approaches to manage and synchronize the Command's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
  import { Command } from "bits-ui";
  let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<Command.Root bind:value={myValue}>
  <!-- ... -->
</Command.Root>
```

#### Key Benefits

- Simplifies state management
- Automatically updates `myValue` when the internal state changes (e.g., via clicking on an item)
- Allows external control (e.g., selecting an item via a separate button)

### 2. Change Handler

To perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute side effects when the value changes.

```svelte
<script lang="ts">
  import { Command } from "bits-ui";
</script>

<Command.Root
  onValueChange={(value) => {
    // do something with the new value
    console.log(value);
  }}
>
  <!-- ... -->
</Command.Root>
```

#### Use Cases

- Implementing custom behaviors on value change
- Integrating with external state management solutions
- Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally. You pass a getter function and a setter function to the `bind:value` directive, giving you full control over how the value is updated/retrieved.

```svelte
<script lang="ts">
  import { Command } from "bits-ui";
  let myValue = $state("");
</script>

<Command.Root bind:value={() => myValue, (newValue) => (myValue = newValue)}>
  <!-- ... -->
</Command.Root>
```

#### When to Use

- Implementing complex value change logic
- Coordinating multiple UI elements
- Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [State Management](/docs/state-management) documentation.

</Callout>

## In a Modal

You can combine the `Command` component with the `Dialog` component to display the command menu within a modal.

<br>

<ComponentPreviewV2 name="command-demo-dialog" componentName="Command" size="xs">

{#snippet preview()}
<CommandDemoDialog />
{/snippet}

</ComponentPreviewV2>

## Grid

You can add the `columns` prop to use the command as a grid.

<br>

<ComponentPreviewV2 name="command-grid-demo" componentName="Command" size="xs">

{#snippet preview()}
<CommandDemoGrid />
{/snippet}

</ComponentPreviewV2>

## Filtering

### Custom Filter

By default, the `Command` component uses a scoring algorithm to determine how the items should be sorted/filtered. You can provide a custom filter function to override this behavior.

The function should return a number between `0` and `1`, with `1` being a perfect match, and `0` being no match, resulting in the item being hidden entirely.

The following example shows how you might implement a strict substring match filter:

```svelte
<script lang="ts">
  import { Command } from "bits-ui";

  function customFilter(
    commandValue: string,
    search: string,
    commandKeywords?: string[]
  ): number {
    return commandValue.includes(search) ? 1 : 0;
  }
</script>

<Command.Root filter={customFilter}>
  <!-- ... -->
</Command.Root>
```

### Extend Default Filter

By default, the `Command` component uses the `computeCommandScore` function to determine the score of each item and filters/sorts them accordingly. This function is exported for you to use and extend as needed.

```svelte
<script lang="ts">
  import { Command, computeCommandScore } from "bits-ui";

  function customFilter(
    commandValue: string,
    search: string,
    commandKeywords?: string[]
  ): number {
    const score = computeCommandScore(commandValue, search, commandKeywords);

    // Add custom logic here
    return score;
  }
</script>

<Command.Root filter={customFilter}>
  <!-- ... -->
</Command.Root>
```

### Disable Filtering

You can disable filtering by setting the `shouldFilter` prop to `false`.

```svelte
<Command.Root shouldFilter={false}>
  <!-- ... -->
</Command.Root>
```

This is useful when you have a lot of custom logic, need to fetch items asynchronously, or just want to handle filtering yourself. You'll be responsible for iterating over the items and determining which ones should be shown.

## Item Selection

You can use the `onSelect` prop to handle the selection of items.

```svelte
<Command.Item onSelect={() => console.log("selected something!")} />
```

## Links

If you want one of the items to get all the benefits of a link (prefetching, etc.), you should use the `Command.LinkItem` component instead of the `Command.Item` component. The only difference is that the `Command.LinkItem` component will render an `a` element instead of a `div` element.

```svelte
<Command.LinkItem href="/some/path">
  <!-- ... -->
</Command.LinkItem>
```

## Imperative API

For more advanced use cases, such as custom keybindings, the `Command.Root` component exposes several methods for programmatic control.

Access these by binding to the component:

```svelte
<script lang="ts">
  import { Command } from "bits-ui";
  let command: typeof Command.Root;
</script>

<Command.Root bind:this={command}>
  <!-- ... -->
</Command.Root>
```

### Methods

#### `getValidItems()`

Returns an array of valid (non-disabled, visible) command items. Useful for checking bounds before operations.

```ts
const items = command.getValidItems();
console.log(items.length); // number of selectable items
```

#### `updateSelectedToIndex(index: number)`

Sets selection to item at specified index. No-op if index is invalid.

```ts
// select third item (if it exists)
command.updateSelectedToIndex(2);

// with bounds check
const items = command.getValidItems();
if (index < items.length) {
  command.updateSelectedToIndex(index);
}
```

#### `updateSelectedByGroup(change: 1 | -1)`

Moves selection to first item in next/previous group. Falls back to next/previous item if no group found.

```ts
command.updateSelectedByGroup(1); // move to next group
command.updateSelectedByGroup(-1); // move to previous group
```

#### `updateSelectedByItem(change: 1 | -1)`

Moves selection up/down relative to current item. Wraps around if `loop` option enabled.

```ts
command.updateSelectedByItem(1); // next item
command.updateSelectedByItem(-1); // previous item
```

### Usage Example

```svelte
<script lang="ts">
  import { Command } from "bits-ui";

  let command: typeof Command.Root;

  function jumpToLastItem() {
    if (!command) return;
    const items = command.getValidItems();
    if (!items.length) return;
    command.updateSelectedToIndex(items.length - 1);
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === "o") {
      jumpToLastItem();
    }
  }}
/>
<Command.Root bind:this={command}>
  <!-- Command content -->
</Command.Root>
```

## Common Mistakes

### Duplicate `value`s

The value of each `Command.Item` **_must_** be unique. If you have two items with the same value, the component will not be able to determine which one to select, causing unexpected behavior when navigating with the keyboard or hovering with the mouse.

If the text content of two items are the same for one reason or another, you should use the `value` prop to set a unique value for each item. When a `value` is set, the text content is used for display purposes only. The `value` prop is used for filtering and selection.

A common pattern is to postfix the `value` with something unique, like an ID or a number so that filtering will still match the value.

```svelte
<Command.Item value="my item 1">My Item</Command.Item>
<Command.Item value="my item 2">My Item</Command.Item>
```

<APISection {schemas} />
