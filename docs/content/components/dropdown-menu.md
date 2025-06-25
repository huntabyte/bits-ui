---
title: Dropdown Menu
description: Displays a menu of items that users can select from when triggered.
---

<script>
	import { APISection, ComponentPreviewV2, DropdownMenuDemo, DropdownMenuDemoTransition, Callout } from '$lib/components'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="dropdown-menu-demo" componentName="Dropdown Menu">

{#snippet preview()}
<DropdownMenuDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
  import { DropdownMenu } from "bits-ui";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger />

  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.GroupHeading />
        <DropdownMenu.Item />
      </DropdownMenu.Group>

      <DropdownMenu.Group>
        <DropdownMenu.Item />
      </DropdownMenu.Group>

      <DropdownMenu.Item />
      <DropdownMenu.CheckboxItem />

      <DropdownMenu.RadioGroup>
        <DropdownMenu.RadioItem />
      </DropdownMenu.RadioGroup>

      <DropdownMenu.CheckboxGroup>
        <DropdownMenu.CheckboxItem />
      </DropdownMenu.CheckboxGroup>

      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger />
        <DropdownMenu.Portal>
          <DropdownMenu.SubContent />
        </DropdownMenu.Portal>
      </DropdownMenu.Sub>

      <DropdownMenu.Separator />
      <DropdownMenu.Arrow />
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

## Reusable Components

If you're planning to use Dropdown Menu in multiple places, you can create a reusable component that wraps the Dropdown Menu component.

This example shows you how to create a Dropdown Menu component that accepts a few custom props that make it more capable.

```svelte title="MyDropdownMenu.svelte"
<script lang="ts">
  import type { Snippet } from "svelte";
  import { DropdownMenu, type WithoutChild } from "bits-ui";

  type Props = DropdownMenu.Props & {
    buttonText: string;
    items: string[];
    contentProps?: WithoutChild<DropdownMenu.Content.Props>;
    // other component props if needed
  };

  let {
    open = $bindable(false),
    children,
    buttonText,
    items,
    contentProps,
    ...restProps
  }: Props = $props();
</script>

<DropdownMenu.Root bind:open {...restProps}>
  <DropdownMenu.Trigger>
    {buttonText}
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content {...contentProps}>
      <DropdownMenu.Group aria-label={buttonText}>
        {#each items as item}
          <DropdownMenu.Item textValue={item}>
            {item}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu.Root>
```

You can then use the `MyDropdownMenu` component like this:

```svelte
<script lang="ts">
  import MyDropdownMenu from "./MyDropdownMenu.svelte";
</script>

<MyDropdownMenu
  buttonText="Select a manager"
  items={["Michael Scott", "Dwight Schrute", "Jim Halpert"]}
/>
```

## Managing Open State

This section covers how to manage the `open` state of the menu.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open Context Menu</button>

<DropdownMenu.Root bind:open={isOpen}>
  <!-- ... -->
</DropdownMenu.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<DropdownMenu.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</DropdownMenu.Root>
```

## Groups

To group related menu items, you can use the `DropdownMenu.Group` component along with either a `DropdownMenu.GroupHeading` or an `aria-label` attribute on the `DropdownMenu.Group` component.

```svelte
<DropdownMenu.Group>
  <DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
  <DropdownMenu.Item>New</DropdownMenu.Item>
  <DropdownMenu.Item>Open</DropdownMenu.Item>
  <DropdownMenu.Item>Save</DropdownMenu.Item>
  <DropdownMenu.Item>Save As</DropdownMenu.Item>
</DropdownMenu.Group>
<!-- or -->
<DropdownMenu.Group aria-label="file">
  <DropdownMenu.Item>New</DropdownMenu.Item>
  <DropdownMenu.Item>Open</DropdownMenu.Item>
  <DropdownMenu.Item>Save</DropdownMenu.Item>
  <DropdownMenu.Item>Save As</DropdownMenu.Item>
</DropdownMenu.Group>
```

### Group Heading

The `DropdownMenu.GroupHeading` component must be a child of either a `DropdownMenu.Group` or `DropdownMenu.RadioGroup` component. If used on its own, an error will be thrown during development.

```svelte
<DropdownMenu.Group>
  <DropdownMenu.GroupHeading>File</DropdownMenu.GroupHeading>
  <!-- ... items here -->
</DropdownMenu.Group>

<!-- or -->

<DropdownMenu.RadioGroup>
  <DropdownMenu.GroupHeading>Favorite color</DropdownMenu.GroupHeading>
  <!-- ... radio items here -->
</DropdownMenu.RadioGroup>
```

## Radio Groups

You can combine the `DropdownMenu.RadioGroup` and `DropdownMenu.RadioItem` components to create a radio group within a menu.

```svelte
<script lang="ts">
  import { DropdownMenu } from "bits-ui";

  const values = ["one", "two", "three"];
  let value = $state("one");
</script>

<DropdownMenu.RadioGroup bind:value>
  <DropdownMenu.GroupHeading>Favorite number</DropdownMenu.GroupHeading>
  {#each values as value}
    <DropdownMenu.RadioItem {value}>
      {#snippet children({ checked })}
        {#if checked}
          ✅
        {/if}
        {value}
      {/snippet}
    </DropdownMenu.RadioItem>
  {/each}
</DropdownMenu.RadioGroup>
```

The `value` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `value` prop.

## Checkbox Items

You can use the `DropdownMenu.CheckboxItem` component to create a `menuitemcheckbox` element to add checkbox functionality to menu items.

```svelte
<script lang="ts">
  import { DropdownMenu } from "bits-ui";

  let notifications = $state(true);
</script>

<DropdownMenu.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      -
    {:else if checked}
      ✅
    {/if}
    Notifications
  {/snippet}
</DropdownMenu.CheckboxItem>
```

The `checked` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `checked` prop.

## Checkbox Groups

You can use the `DropdownMenu.CheckboxGroup` component around a set of `DropdownMenu.CheckboxItem` components to create a checkbox group within a menu, where the `value` prop is an array of the selected values.

```svelte
<script lang="ts">
  import { DropdownMenu } from "bits-ui";

  let colors = $state<string[]>([]);
</script>

<DropdownMenu.CheckboxGroup bind:value={colors}>
  <DropdownMenu.GroupHeading>Favorite color</DropdownMenu.GroupHeading>
  <DropdownMenu.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Red
    {/snippet}
  </DropdownMenu.CheckboxItem>
  <DropdownMenu.CheckboxItem value="blue">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Blue
    {/snippet}
  </DropdownMenu.CheckboxItem>
  <DropdownMenu.CheckboxItem value="green">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Green
    {/snippet}
  </DropdownMenu.CheckboxItem>
</DropdownMenu.CheckboxGroup>
```

The `value` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `value` prop.

## Nested Menus

You can create nested menus using the `DropdownMenu.Sub` component to create complex menu structures.

```svelte /DropdownMenu.Sub/
<script lang="ts">
  import { DropdownMenu } from "bits-ui";
</script>

<DropdownMenu.Content>
  <DropdownMenu.Item>Item 1</DropdownMenu.Item>
  <DropdownMenu.Item>Item 2</DropdownMenu.Item>
  <DropdownMenu.Sub>
    <DropdownMenu.SubTrigger>Open Sub Menu</DropdownMenu.SubTrigger>
    <DropdownMenu.SubContent>
      <DropdownMenu.Item>Sub Item 1</DropdownMenu.Item>
      <DropdownMenu.Item>Sub Item 2</DropdownMenu.Item>
    </DropdownMenu.SubContent>
  </DropdownMenu.Sub>
</DropdownMenu.Content>
```

<!-- <DropdownMenuDemoNested /> -->

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `DropdownMenu.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import { fly } from "svelte/transition";
</script>

<DropdownMenu.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <DropdownMenu.Item>Item 1</DropdownMenu.Item>
          <DropdownMenu.Item>Item 2</DropdownMenu.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</DropdownMenu.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<ComponentPreviewV2 name="dropdown-menu-demo-transition" componentName="DropdownMenu" containerClass="mt-4">

{#snippet preview()}
<DropdownMenuDemoTransition />
{/snippet}

</ComponentPreviewV2>

## Custom Anchor

By default, the `DropdownMenu.Content` is anchored to the `DropdownMenu.Trigger` component, which determines where the content is positioned.

If you wish to instead anchor the content to a different element, you can pass either a selector `string` or an `HTMLElement` to the `customAnchor` prop of the `DropdownMenu.Content` component.

```svelte
<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  let customAnchor = $state<HTMLElement>(null!);
</script>

<div bind:this={customAnchor}></div>

<DropdownMenu.Root>
  <DropdownMenu.Trigger />
  <DropdownMenu.Content {customAnchor}>
    <!-- ... -->
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

<APISection {schemas} />
