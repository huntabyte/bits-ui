---
title: Select
description: Enables users to pick from a list of options displayed in a dropdown.
---

<script>
	import { APISection, ComponentPreview, SelectDemo, SelectDemoCustomAnchor, SelectDemoItemAligned, SelectDemoMultiple, SelectDemoTransition, SelectDemoAutoScrollDelay, Callout } from '$lib/components'
	let { schemas } = $props()
</script>

<ComponentPreview name="select-demo" componentName="Select" variant="preview">

{#snippet preview()}
<SelectDemo />
{/snippet}

</ComponentPreview>

## Overview

The Select component provides users with a selectable list of options. It's designed to offer an enhanced selection experience with features like typeahead search, keyboard navigation, and customizable grouping. This component is particularly useful for scenarios where users need to choose from a predefined set of options, offering more functionality than a standard select element.

## Key Features

- **Typeahead Search**: Users can quickly find options by typing
- **Keyboard Navigation**: Full support for keyboard interactions, allowing users to navigate through options using arrow keys, enter to select, and more.
- **Grouped Options**: Ability to organize options into logical groups, enhancing readability and organization of large option sets.
- **Scroll Management**: Includes scroll up/down buttons for easy navigation in long lists.
- **Accessibility**: Built-in ARIA attributes and keyboard support ensure compatibility with screen readers and adherence to accessibility standards.
- **Portal Support**: Option to render the select content in a portal, preventing layout issues in complex UI structures.

## Architecture

The Select component is composed of several sub-components, each with a specific role:

- **Root**: The main container component that manages the state and context for the combobox.
- **Trigger**: The button or element that opens the dropdown list.
- **Portal**: Responsible for portalling the dropdown content to the body or a custom target.
- **Group**: A container for grouped items, used to group related items.
- **GroupHeading**: A heading for a group of items, providing a descriptive label for the group.
- **Item**: An individual item within the list.
- **Content**: The dropdown container that displays the items. It uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger.
- **ContentStatic** (Optional): An alternative to the Content component, that enables you to opt-out of Floating UI and position the content yourself.
- **Viewport**: The visible area of the dropdown content, used to determine the size and scroll behavior.
- **ScrollUpButton**: A button that scrolls the content up when the content is larger than the viewport.
- **ScrollDownButton**: A button that scrolls the content down when the content is larger than the viewport.
- **Arrow**: An arrow element that points to the trigger when using the `Combobox.Content` component.

## Structure

Here's an overview of how the Select component is structured in code:

```svelte
<script lang="ts">
  import { Select } from "bits-ui";
</script>

<Select.Root>
  <Select.Trigger />
  <Select.Portal>
    <Select.Content>
      <Select.ScrollUpButton />
      <Select.Viewport>
        <Select.Item />
        <Select.Group>
          <Select.GroupHeading />
          <Select.Item />
        </Select.Group>
        <Select.ScrollDownButton />
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

## Reusable Components

As you can see from the structure above, there are a number of pieces that make up the `Select` component. These pieces are provided to give you maximum flexibility and customization options, but can be a burden to write out everywhere you need to use a select in your application.

To ease this burden, it's recommended to create your own reusable select component that wraps the primitives and provides a more convenient API for your use cases.

Here's an example of how you might create a reusable `MySelect` component that receives a list of options and renders each of them as an item.

```svelte title="MySelect.svelte"
<script lang="ts">
  import { Select, type WithoutChildren } from "bits-ui";

  type Props = WithoutChildren<Select.RootProps> & {
    placeholder?: string;
    items: { value: string; label: string; disabled?: boolean }[];
    contentProps?: WithoutChildren<Select.ContentProps>;
    // any other specific component props if needed
  };

  let {
    value = $bindable(),
    items,
    contentProps,
    placeholder,
    ...restProps
  }: Props = $props();

  const selectedLabel = $derived(
    items.find((item) => item.value === value)?.label
  );
</script>

<!--
TypeScript Discriminated Unions + destructing (required for "bindable") do not
get along, so we shut typescript up by casting `value` to `never`, however,
from the perspective of the consumer of this component, it will be typed appropriately.
-->
<Select.Root bind:value={value as never} {...restProps}>
  <Select.Trigger>
    {selectedLabel ? selectedLabel : placeholder}
  </Select.Trigger>
  <Select.Portal>
    <Select.Content {...contentProps}>
      <Select.ScrollUpButton>up</Select.ScrollUpButton>
      <Select.Viewport>
        {#each items as { value, label, disabled } (value)}
          <Select.Item {value} {label} {disabled}>
            {#snippet children({ selected })}
              {selected ? "✅" : ""}
              {label}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
      <Select.ScrollDownButton>down</Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

You can then use the `MySelect` component throughout your application like so:

```svelte
<script lang="ts">
  import MySelect from "$lib/components/MySelect.svelte";

  const items = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  let fruit = $state("apple");
</script>

<MySelect {items} bind:value={fruit} />
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Select } from "bits-ui";
  let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<Select.Root type="single" bind:value={myValue}>
  <!-- ... -->
</Select.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Select } from "bits-ui";
  let myValue = $state("");

  function getValue() {
    return myValue;
  }

  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>

<Select.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</Select.Root>
```

## Managing Open State

This section covers how to manage the `open` state of the component.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Select } from "bits-ui";
  let myOpen = $state(false);
</script>

<button onclick={() => (myOpen = true)}> Open </button>

<Select.Root bind:open={myOpen}>
  <!-- ... -->
</Select.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Select } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<Select.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</Select.Root>
```

## Multiple Selection

The `type` prop can be set to `'multiple'` to allow multiple items to be selected at a time.

```svelte
<script lang="ts">
  import { Select } from "bits-ui";

  let value = $state<string[]>([]);
</script>

<Select.Root type="multiple" bind:value>
  <!-- ... -->
</Select.Root>
```

<ComponentPreview name="select-demo-multiple" componentName="Select">

{#snippet preview()}
<SelectDemoMultiple />
{/snippet}

</ComponentPreview>

## Opt-out of Floating UI

When you use the `Select.Content` component, Bits UI uses [Floating UI](https://floating-ui.com/) to position the content relative to the trigger, similar to other popover-like components.

You can opt-out of this behavior by instead using the `Select.ContentStatic` component.

```svelte /Select.ContentStatic/
<Select.Root>
  <Select.Trigger />
  <Select.Portal>
    <Select.ContentStatic>
      <Select.ScrollUpButton />
      <Select.Viewport>
        <Select.Item />
        <Select.Group>
          <Select.GroupHeading />
          <Select.Item />
        </Select.Group>
        <Select.ScrollDownButton />
      </Select.Viewport>
    </Select.ContentStatic>
  </Select.Portal>
</Select.Root>
```

When using this component, you'll need to handle the positioning of the content yourself. Keep in mind that using `Select.Portal` alongside `Select.ContentStatic` may result in some unexpected positioning behavior, feel free to not use the portal or work around it.

## Custom Anchor

By default, the `Select.Content` is anchored to the `Select.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector string or an `HTMLElement` to the `customAnchor` prop of the `Select.Content` component.

```svelte
<script lang="ts">
  import { Select } from "bits-ui";

  let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<Select.Root>
  <Select.Trigger />
  <Select.Content {customAnchor}>
    <!-- ... -->
  </Select.Content>
</Select.Root>
```

<SelectDemoCustomAnchor />

## Item-Aligned Positioning

By default, `Select.Content` uses `position="popper"`, which follows standard Floating UI placement.

If you want MacOS native style item alignment, set `position="item-aligned"`:

- The selected item is aligned with the trigger value.
- The content still uses the trigger as its anchor.
- The content falls back to normal popper positioning when alignment isn't possible.

```svelte /position="item-aligned"/
<Select.Root type="single">
  <Select.Trigger />
  <Select.Portal>
    <Select.Content position="item-aligned">
      <Select.Viewport>
        <!-- items -->
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

When `position="item-aligned"` is active, `side`, `align`, and `alignOffset` are ignored. If it falls back to popper behavior, those props apply again.

<ComponentPreview name="select-demo-item-aligned" componentName="Select">

{#snippet preview()}
<SelectDemoItemAligned />
{/snippet}

</ComponentPreview>

## What is the Viewport?

The `Select.Viewport` component is used to determine the size of the content in order to determine whether or not the scroll up and down buttons should be rendered.

If you wish to set a minimum/maximum height for the select content, you should apply it to the `Select.Viewport` component.

## Scroll Up/Down Buttons

The `Select.ScrollUpButton` and `Select.ScrollDownButton` components are used to render the scroll up and down buttons when the select content is larger than the viewport.

You must use the `Select.Viewport` component when using the scroll buttons.

### Custom Scroll Delay

The initial and subsequent scroll delays can be controlled using the `delay` prop on the buttons.

For example, we can use the [`cubicOut`](https://svelte.dev/docs/svelte/svelte-easing#cubicOut) easing function from Svelte to create a smooth scrolling effect that speeds up over time.

<ComponentPreview name="select-demo-auto-scroll-delay" componentName="Select">

{#snippet preview()}
<SelectDemoAutoScrollDelay />
{/snippet}

</ComponentPreview>

## Native Scrolling/Overflow

If you don't want to use the [scroll buttons](#scroll-updown-buttons) and prefer to use the standard scrollbar/overflow behavior, you can omit the `Select.Scroll[Up|Down]Button` components and the `Select.Viewport` component.

You'll need to set a height on the `Select.Content` component and appropriate `overflow` styles to enable scrolling.

## Scroll Lock

By default, when a user opens the select, scrolling outside the content will not be disabled. You can override this behavior by setting the `preventScroll` prop to `true`.

```svelte /preventScroll={false}/
<Select.Content preventScroll={true}>
  <!-- ... -->
</Select.Content>
```

## Highlighted Items

The Select component follows the [WAI-ARIA descendant pattern](https://www.w3.org/TR/wai-aria-practices-1.2/#combobox) for highlighting items. This means that the `Select.Trigger` retains focus the entire time, even when navigating with the keyboard, and items are highlighted as the user navigates them.

### Styling Highlighted Items

You can use the `data-highlighted` attribute on the `Select.Item` component to style the item differently when it is highlighted.

### onHighlight / onUnhighlight

To trigger side effects when an item is highlighted or unhighlighted, you can use the `onHighlight` and `onUnhighlight` props.

```svelte
<Select.Item onHighlight={() => console.log('I am highlighted!')} onUnhighlight={() => console.log('I am unhighlighted!')} />
<!-- ... -->
</Select.Item>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Select.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
  import { Select } from "bits-ui";
  import { fly } from "svelte/transition";
</script>

<Select.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <!-- ... -->
        </div>
      </div>
    {/if}
  {/snippet}
</Select.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreview name="select-demo-transition" componentName="Select" containerClass="mt-4">

{#snippet preview()}
<SelectDemoTransition />
{/snippet}

</ComponentPreview>

<APISection {schemas} />
