---
title: Menubar
description: Organizes and presents a collection of menu options or actions within a horizontal bar.
---

<script>
	import { APISection, ComponentPreviewV2, MenubarDemo } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="menubar-demo" componentName="Menubar">

{#snippet preview()}
<MenubarDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger />
    <Menubar.Portal>
      <Menubar.Content>
        <Menubar.Group>
          <Menubar.GroupHeading />
          <Menubar.Item />
        </Menubar.Group>

        <Menubar.Item />

        <Menubar.CheckboxItem>
          {#snippet children({ checked })}
            {checked ? "✅" : ""}
          {/snippet}
        </Menubar.CheckboxItem>

        <Menubar.RadioGroup>
          <Menubar.GroupHeading />
          <Menubar.RadioItem>
            {#snippet children({ checked })}
              {checked ? "✅" : ""}
            {/snippet}
          </Menubar.RadioItem>
        </Menubar.RadioGroup>

        <Menubar.Sub>
          <Menubar.SubTrigger />
          <Menubar.SubContent />
        </Menubar.Sub>

        <Menubar.Separator />
        <Menubar.Arrow />
      </Menubar.Content>
    </Menubar.Portal>
  </Menubar.Menu>
</Menubar.Root>
```

## Reusable Components

If you're planning to use Menubar in multiple places, you can create reusable components that wrap the different parts of the Menubar.

In the following example, we're creating a reusable `MyMenubarMenu` component that contains the trigger, content, and items of a menu.

```svelte title="MyMenubarMenu.svelte"
<script lang="ts">
  import { Menubar, type WithoutChildrenOrChild } from "bits-ui";

  type Props = WithoutChildrenOrChild<Menubar.MenuProps> & {
    triggerText: string;
    items: { label: string; value: string; onSelect?: () => void }[];
    contentProps?: WithoutChildrenOrChild<Menubar.ContentProps>;
    // other component props if needed
  };

  let { triggerText, items, contentProps, ...restProps }: Props = $props();
</script>

<Menubar.Menu {...restProps}>
  <Menubar.Trigger>
    {triggerText}
  </Menubar.Trigger>
  <Menubar.Content {...contentProps}>
    <Menubar.Group aria-label={triggerText}>
      {#each items as item}
        <Menubar.Item textValue={item.label} onSelect={item.onSelect}>
          {item.label}
        </Menubar.Item>
      {/each}
    </Menubar.Group>
  </Menubar.Content>
</Menubar.Menu>
```

Now, we can use the `MyMenubarMenu` component within a `Menubar.Root` component to render out the various menus.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  import MyMenubarMenu from "./MyMenubarMenu.svelte";

  const sales = [
    { label: "Michael Scott", value: "michael" },
    { label: "Dwight Schrute", value: "dwight" },
    { label: "Jim Halpert", value: "jim" },
    { label: "Stanley Hudson", value: "stanley" },
    { label: "Phyllis Vance", value: "phyllis" },
    { label: "Pam Beesly", value: "pam" },
    { label: "Andy Bernard", value: "andy" },
  ];

  const hr = [
    { label: "Toby Flenderson", value: "toby" },
    { label: "Holly Flax", value: "holly" },
    { label: "Jan Levinson", value: "jan" },
  ];

  const accounting = [
    { label: "Angela Martin", value: "angela" },
    { label: "Kevin Malone", value: "kevin" },
    { label: "Oscar Martinez", value: "oscar" },
  ];

  const menubarMenus = [
    { title: "Sales", items: sales },
    { title: "HR", items: hr },
    { title: "Accounting", items: accounting },
  ];
</script>

<Menubar.Root>
  {#each menubarMenus as { title, items }}
    <CustomMenubar triggerText={title} {items} />
  {/each}
</Menubar.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the menubar.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { Menubar } from "bits-ui";
  let activeValue = $state("");
</script>

<button onclick={() => (activeValue = "menu-1")}>Open Menubar Menu</button>
<Menubar.Root bind:value={activeValue}>
  <Menubar.Menu value="menu-1">
    <!-- ... -->
  </Menubar.Menu>
  <Menubar.Menu value="menu-2">
    <!-- ... -->
  </Menubar.Menu>
</Menubar.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";
  let activeValue = $state("");

  function getValue() {
    return activeValue;
  }

  function setValue(newValue: string) {
    activeValue = newValue;
  }
</script>

<Menubar.Root bind:value={getValue, setValue}>
  <Menubar.Menu value="menu-1">
    <!-- ... -->
  </Menubar.Menu>
  <Menubar.Menu value="menu-2">
    <!-- ... -->
  </Menubar.Menu>
</Menubar.Root>
```

## Radio Groups

You can combine the `Menubar.RadioGroup` and `Menubar.RadioItem` components to create a radio group within a menu.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";

  const values = ["one", "two", "three"];
  let value = $state("one");
</script>

<Menubar.RadioGroup bind:value>
  {#each values as value}
    <Menubar.RadioItem {value}>
      {#snippet children({ checked })}
        {#if checked}
          ✅
        {/if}
        {value}
      {/snippet}
    </Menubar.RadioItem>
  {/each}
</Menubar.RadioGroup>
```

## Checkbox Items

You can use the `Menubar.CheckboxItem` component to create a `menuitemcheckbox` element to add checkbox functionality to menu items.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";

  let notifications = $state(true);
</script>

<Menubar.CheckboxItem bind:checked={notifications}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      -
    {:else if checked}
      ✅
    {/if}
    Notifications
  {/snippet}
</Menubar.CheckboxItem>
```

## Checkbox Groups

You can use the `Menubar.CheckboxGroup` component around a set of `Menubar.CheckboxItem` components to create a checkbox group within a menu, where the `value` prop is an array of the selected values.

```svelte
<script lang="ts">
  import { Menubar } from "bits-ui";

  let colors = $state<string[]>([]);
</script>

<Menubar.CheckboxGroup bind:value={colors}>
  <Menubar.GroupHeading>Favorite color</Menubar.GroupHeading>
  <Menubar.CheckboxItem value="red">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Red
    {/snippet}
  </Menubar.CheckboxItem>
  <Menubar.CheckboxItem value="blue">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Blue
    {/snippet}
  </Menubar.CheckboxItem>
  <Menubar.CheckboxItem value="green">
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
      Green
    {/snippet}
  </Menubar.CheckboxItem>
</Menubar.CheckboxGroup>
```

The `value` state does not persist between menu open/close cycles. To persist the state, you must store it in a `$state` variable and pass it to the `value` prop.

## Nested Menus

You can create nested menus using the `Menubar.Sub` component to create complex menu structures.

```svelte /Menubar.Sub/
<script lang="ts">
  import { Menubar } from "bits-ui";
</script>

<Menubar.Content>
  <Menubar.Item>Item 1</Menubar.Item>
  <Menubar.Item>Item 2</Menubar.Item>
  <Menubar.Sub>
    <Menubar.SubTrigger>Open Sub Menu</Menubar.SubTrigger>
    <Menubar.SubContent>
      <Menubar.Item>Sub Item 1</Menubar.Item>
      <Menubar.Item>Sub Item 2</Menubar.Item>
    </Menubar.SubContent>
  </Menubar.Sub>
</Menubar.Content>
```

## Svelte Transitions

You can use the `forceMount` prop along with the `child` snippet to forcefully mount the `Menubar.Content` component to use Svelte Transitions or another animation library that requires more control.

```svelte /forceMount/ /transition:fly/
<script lang="ts">
  import { Menubar } from "bits-ui";
  import { fly } from "svelte/transition";
</script>

<Menubar.Content forceMount>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <div {...props} transition:fly>
          <Menubar.Item>Item 1</Menubar.Item>
          <Menubar.Item>Item 2</Menubar.Item>
        </div>
      </div>
    {/if}
  {/snippet}
</Menubar.Content>
```

Of course, this isn't the prettiest syntax, so it's recommended to create your own reusable content component that handles this logic if you intend to use this approach. For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<APISection {schemas} />
