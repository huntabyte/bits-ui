---
title: Combobox
description: Enables users to pick from a list of options displayed in a dropdown.
---

<script>
	import { APISection, ComponentPreview, ComboboxDemo, ComboboxDemoTransition, ComboboxDemoAutoScrollDelay, ComboboxDemoChips, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreview name="combobox-demo" componentName="Combobox" variant="preview">

{#snippet preview()}
<ComboboxDemo />
{/snippet}

</ComponentPreview>

## Overview

The Combobox component combines the functionality of an input field with a dropdown list of selectable options. It provides users with the ability to search, filter, and select from a predefined set of choices.

## Key Features

- **Keyboard Navigation**: Full support for keyboard interactions, allowing users to navigate and select options without using a mouse.
- **Customizable Rendering**: Flexible architecture for rendering options, including support for grouped items.
- **Accessibility**: Built with ARIA attributes and keyboard interactions to ensure screen reader compatibility and accessibility standards.
- **Portal Support**: Ability to render the dropdown content in a portal, preventing layout issues in complex UI structures.

## Architecture

The Combobox component is composed of several sub-components, each with a specific role:

- **Root**: The main container component that manages the state and context for the combobox.
- **Input**: The input field that allows users to enter search queries.
- **Trigger**: The button or element that opens the dropdown list.
- **Portal**: Responsible for portalling the dropdown content to the body or a custom target.
- **Group**: A container for grouped items, used to group related items.
- **GroupHeading**: A heading for a group of items, providing a descriptive label for the group.
- **Item**: An individual item within the list.
- **Content**: The dropdown container that displays the items. It uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger.
- **ContentStatic**: An alternative to the Content component, that enables you to opt-out of Floating UI and position the content yourself.
- **Viewport**: The visible area of the dropdown content, used to determine the size and scroll behavior.
- **ScrollUpButton**: A button that scrolls the content up when the content is larger than the viewport.
- **ScrollDownButton**: A button that scrolls the content down when the content is larger than the viewport.
- **Arrow**: An arrow element that points to the trigger when using the `Combobox.Content` component.

## Structure

Here's an overview of how the Combobox component is structured in code:

```svelte
<script lang="ts">
  import { Combobox } from "bits-ui";
</script>

<Combobox.Root>
  <Combobox.Input />
  <Combobox.Trigger />
  <Combobox.Portal>
    <Combobox.Content>
      <Combobox.Group>
        <Combobox.GroupHeading />
        <Combobox.Item />
      </Combobox.Group>
      <Combobox.Item />
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

## Reusable Components

It's recommended to use the `Combobox` primitives to build your own custom combobox component that can be reused throughout your application.

```svelte title="CustomCombobox.svelte"
<script lang="ts">
  import { Combobox, type WithoutChildrenOrChild, mergeProps } from "bits-ui";

  type Props = Combobox.RootProps & {
    inputProps?: WithoutChildrenOrChild<Combobox.InputProps>;
    contentProps?: WithoutChildrenOrChild<Combobox.ContentProps>;
  };

  let {
    items = [],
    value = $bindable(),
    open = $bindable(false),
    inputProps,
    contentProps,
    type,
    ...restProps
  }: Props = $props();

  let searchValue = $state("");

  const filteredItems = $derived.by(() => {
    if (searchValue === "") return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
    searchValue = e.currentTarget.value;
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) searchValue = "";
  }

  const mergedRootProps = $derived(
    mergeProps(restProps, { onOpenChange: handleOpenChange })
  );
  const mergedInputProps = $derived(
    mergeProps(inputProps, { oninput: handleInput })
  );
</script>

<!--
Destructuring (required for bindable) and discriminated unions don't play well together,
so we cast the value to `never` to avoid type errors here. However, on the consumer
side, the component will still be type-checked correctly.
-->
<Combobox.Root
  {type}
  {items}
  bind:value={value as never}
  bind:open
  {...mergedRootProps}
>
  <Combobox.Input {...mergedInputProps} />
  <Combobox.Trigger>Open</Combobox.Trigger>
  <Combobox.Portal>
    <Combobox.Content {...contentProps}>
      {#each filteredItems as item, i (i + item.value)}
        <Combobox.Item {...item}>
          {#snippet children({ selected })}
            {item.label}
            {selected ? "✅" : ""}
          {/snippet}
        </Combobox.Item>
      {:else}
        <span> No results found </span>
      {/each}
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

```svelte title="+page.svelte"
<script lang="ts">
  import { CustomCombobox } from "$lib/components";

  const items = [
    { value: "mango", label: "Mango" },
    { value: "watermelon", label: "Watermelon" },
    { value: "apple", label: "Apple" },
    // ...
  ];
</script>

<CustomCombobox type="single" {items} />
```

## Managing Value State

This section covers how to manage the `value` state of the Combobox.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Combobox } from "bits-ui";
  let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<Combobox.Root type="single" bind:value={myValue}>
  <!-- ... -->
</Combobox.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Combobox } from "bits-ui";
  let myValue = $state("");

  function getValue() {
    return myValue;
  }

  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>

<Combobox.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</Combobox.Root>
```

## Managing Open State

This section covers how to manage the `open` state of the Combobox.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Combobox } from "bits-ui";
  let myOpen = $state(false);
</script>

<button onclick={() => (myOpen = true)}> Open </button>

<Combobox.Root bind:open={myOpen}>
  <!-- ... -->
</Combobox.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Combobox } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<Combobox.Root type="single" bind:open={getOpen, setOpen}>
  <!-- ... -->
</Combobox.Root>
```

## Opt-out of Floating UI

When you use the `Combobox.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `Combobox.ContentStatic` component.

```svelte /Combobox.ContentStatic/
<Combobox.Root>
  <Combobox.Trigger />
  <Combobox.Input />
  <Combobox.Portal>
    <Combobox.ContentStatic>
      <Combobox.ScrollUpButton />
      <Combobox.Viewport>
        <Combobox.Item />
        <Combobox.Group>
          <Combobox.GroupHeading />
          <Combobox.Item />
        </Combobox.Group>
      </Combobox.Viewport>
      <Combobox.ScrollDownButton />
    </Combobox.ContentStatic>
  </Combobox.Portal>
</Combobox.Root>
```

When using this component, you'll need to handle the positioning of the content yourself. Keep in mind that using `Combobox.Portal` alongside `Combobox.ContentStatic` may result in some unexpected positioning behavior, feel free to not use the portal or work around it.

## Custom Anchor

By default, the `Combobox.Content` is anchored to the `Combobox.Input` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector string or an `HTMLElement` to the `customAnchor` prop of the `Combobox.Content` component.

```svelte
<script lang="ts">
  import { Combobox } from "bits-ui";

  let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Combobox.Root>
  <Combobox.Trigger />
  <Combobox.Input />
  <Combobox.Content {customAnchor}>
    <!-- ... -->
  </Combobox.Content>
</Combobox.Root>
```

## What is the Viewport?

The `Combobox.Viewport` component is used to determine the size of the content in order to determine whether or not the scroll up and down buttons should be rendered.

If you wish to set a minimum/maximum height for the select content, you should apply it to the `Combobox.Viewport` component.

## Scroll Up/Down Buttons

The `Combobox.ScrollUpButton` and `Combobox.ScrollDownButton` components are used to render the scroll up and down buttons when the select content is larger than the viewport.

You must use the `Combobox.Viewport` component when using the scroll buttons.

### Custom Scroll Delay

The initial and subsequent scroll delays can be controlled using the `delay` prop on the buttons.

For example, we can use the [`cubicOut`](https://svelte.dev/docs/svelte/svelte-easing#cubicOut) easing function from Svelte to create a smooth scrolling effect that speeds up over time.

<ComponentPreview name="combobox-demo-auto-scroll-delay" componentName="Combobox">

{#snippet preview()}
<ComboboxDemoAutoScrollDelay />
{/snippet}

</ComponentPreview>

## Native Scrolling/Overflow

If you don't want to use the [scroll buttons](#scroll-updown-buttons) and prefer to use the standard scrollbar/overflow behavior, you can omit the `Combobox.Scroll[Up|Down]Button` components and the `Combobox.Viewport` component.

You'll need to set a height on the `Combobox.Content` component and appropriate `overflow` styles to enable scrolling.

## Scroll Lock

To prevent the user from scrolling outside of the `Combobox.Content` component when open, you can set the `preventScroll` prop to `true`.

```svelte /preventScroll={true}/
<Combobox.Content preventScroll={true}>
  <!-- ... -->
</Combobox.Content>
```

## Highlighted Items

The Combobox component follows the [WAI-ARIA descendant pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) for highlighting items. This means that the `Combobox.Input` retains focus the entire time, even when navigating with the keyboard, and items are highlighted as the user navigates them.

### Styling Highlighted Items

You can use the `data-highlighted` attribute on the `Combobox.Item` component to style the item differently when it is highlighted.

### onHighlight / onUnhighlight

To trigger side effects when an item is highlighted or unhighlighted, you can use the `onHighlight` and `onUnhighlight` props.

```svelte
<Combobox.Item onHighlight={() => console.log('I am highlighted!')} onUnhighlight={() => console.log('I am unhighlighted!')} />
<!-- ... -->
</Combobox.Item>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Combobox.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
  import { Combobox } from "bits-ui";
  import { fly } from "svelte/transition";
</script>

<Combobox.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- ... -->
        </div>
      </div>
    {/if}
  {/snippet}
</Combobox.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreview name="combobox-demo-transition" componentName="Select" containerClass="mt-4">

{#snippet preview()}
<ComboboxDemoTransition />
{/snippet}

</ComponentPreview>

## Chips

For multi-select comboboxes, you can use the `Combobox.Chips`, `Combobox.Chip`, and `Combobox.ChipRemove` components to display selected values as removable chips within the input area.

<ComponentPreview name="combobox-chips-demo" componentName="Combobox" containerClass="mt-4">

{#snippet preview()}
<ComboboxDemoChips />
{/snippet}

</ComponentPreview>

### Structure

The chips components are designed to wrap the input, providing a unified styling area:

```svelte
<Combobox.Root type="multiple" items={fruits}>
  <Combobox.Chips>
    {#snippet children({ selectedItems })}
      {#each selectedItems as item (item.value)}
        <Combobox.Chip value={item.value}>
          {#snippet children({ label })}
            <span>{label}</span>
            <Combobox.ChipRemove aria-label="Remove {label}">
              ×
            </Combobox.ChipRemove>
          {/snippet}
        </Combobox.Chip>
      {/each}
      <Combobox.Input placeholder="Add more..." />
    {/snippet}
  </Combobox.Chips>
  <Combobox.Portal>
    <Combobox.Content>
      <!-- items -->
    </Combobox.Content>
  </Combobox.Portal>
</Combobox.Root>
```

### Keyboard Navigation

Chips support full keyboard navigation:

| Key                        | Action                                                      |
| -------------------------- | ----------------------------------------------------------- |
| `ArrowLeft`                | When cursor is at the start of input, focuses last chip     |
| `Backspace`                | When input is empty, focuses last chip                      |
| `ArrowLeft` / `ArrowRight` | Navigate between chips                                      |
| `Backspace` / `Delete`     | Remove focused chip, then focus next/previous chip or input |
| `Tab`                      | From chip, focuses input                                    |
| `Shift+Tab`                | From chip, focuses previous element outside combobox        |
| `Enter` / `Space`          | From chip, focuses input                                    |
| `ArrowDown` / `ArrowUp`    | Opens popup and focuses input                               |

### Selected Items

The `Combobox.Chips` component provides a `selectedItems` array via its snippet props. Each item contains:

- `value`: The value of the selected item
- `label`: The display label (derived from the `items` prop on Root, or falls back to the value)

This allows you to render chips using the same data structure as your items.

### Styling Focus

The `Combobox.Chips` container exposes a `data-focus-within` attribute when any child (chip or input) has focus. Use this to style the container as if it were a focused input:

```svelte
<Combobox.Chips
  class="rounded-md border p-2 data-[focus-within]:ring-2 data-[focus-within]:ring-blue-500"
>
  <!-- ... -->
</Combobox.Chips>
```

Individual chips expose a `data-highlighted` attribute when focused, allowing you to style the currently active chip:

```svelte
<Combobox.Chip
  value={item.value}
  class="rounded px-2 py-1 data-[highlighted]:ring-2"
>
  <!-- ... -->
</Combobox.Chip>
```

<APISection {schemas} />
