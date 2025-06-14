---
title: Checkbox
description: Allow users to switch between checked, unchecked, and indeterminate states.
---

<script>
	import { APISection, ComponentPreviewV2, CheckboxDemo, CheckboxDemoCustom, CheckboxDemoGroup, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="checkbox-demo" componentName="Checkbox">

{#snippet preview()}
<CheckboxDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Checkbox component provides a flexible and accessible way to create checkbox inputs in your Svelte applications. It supports three states: checked, unchecked, and indeterminate, allowing for complex form interactions and data representations.

## Key Features

- **Tri-State Support**: Handles checked, unchecked, and indeterminate states, providing versatility in form design.
- **Accessibility**: Built with WAI-ARIA guidelines in mind, ensuring keyboard navigation and screen reader support.
- **Flexible State Management**: Supports both controlled and uncontrolled state, allowing for full control over the checkbox's checked state.

## Architecture

The Checkbox component is composed of the following parts:

- **Root**: The main component that manages the state and behavior of the checkbox.

## Structure

Here's an overview of how the Checkbox component is structured in code:

```svelte
<script lang="ts">
  import { Checkbox } from "bits-ui";
</script>

<Checkbox.Root>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      -
    {:else if checked}
      ✅
    {:else}
      ❌
    {/if}
  {/snippet}
</Checkbox.Root>
```

## Reusable Components

It's recommended to use the `Checkbox` primitive to create your own custom checkbox component that can be used throughout your application. In the example below, we're using the `Checkbox` and [`Label`](/docs/components/label) components to create a custom checkbox component.

```svelte title="MyCheckbox.svelte"
<script lang="ts">
  import {
    Checkbox,
    Label,
    useId,
    type WithoutChildrenOrChild,
  } from "bits-ui";

  let {
    id = useId(),
    checked = $bindable(false),
    ref = $bindable(null),
    labelRef = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<Checkbox.RootProps> & {
    labelText: string;
    labelRef?: HTMLLabelElement | null;
  } = $props();
</script>

<Checkbox.Root bind:checked bind:ref {...restProps}>
  {#snippet children({ checked, indeterminate })}
    {#if indeterminate}
      -
    {:else if checked}
      ✅
    {:else}
      ❌
    {/if}
  {/snippet}
</Checkbox.Root>
<Label.Root for={id} bind:ref={labelRef}>
  {labelText}
</Label.Root>
```

You can then use the `MyCheckbox` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
  import MyCheckbox from "$lib/components/MyCheckbox.svelte";
</script>

<MyCheckbox labelText="Enable notifications" />
```

<CheckboxDemoCustom labelText="Enable notifications" />

## Managing Checked State

This section covers how to manage the `checked` state of the Checkbox.

### Two-Way Binding

Use `bind:checked` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Checkbox } from "bits-ui";
  let myChecked = $state(false);
</script>

<button onclick={() => (myChecked = false)}> uncheck </button>

<Checkbox.Root bind:checked={myChecked} />
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Checkbox } from "bits-ui";
  let myChecked = $state(false);

  function getChecked() {
    return myChecked;
  }

  function setChecked(newChecked: boolean) {
    myChecked = newChecked;
  }
</script>

<Checkbox.Root bind:checked={getChecked, setChecked}>
  <!-- ... -->
</Checkbox.Root>
```

## Managing Indeterminate State

This section covers how to manage the `indeterminate` state of the Checkbox.

### Two-Way Binding

Use `bind:indeterminate` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import MyCheckbox from "$lib/components/MyCheckbox.svelte";
  let myIndeterminate = $state(true);
</script>

<button onclick={() => (myIndeterminate = false)}>
  clear indeterminate
</button>

<MyCheckbox bind:indeterminate={myIndeterminate} />
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Checkbox } from "bits-ui";
  let myIndeterminate = $state(true);

  function getIndeterminate() {
    return myIndeterminate;
  }

  function setIndeterminate(newIndeterminate: boolean) {
    myIndeterminate = newIndeterminate;
  }
</script>

<Checkbox.Root bind:indeterminate={getIndeterminate, setIndeterminate}>
  <!-- ... -->
</Checkbox.Root>
```

## Disabled State

You can disable the checkbox by setting the `disabled` prop to `true`.

```svelte /disabled/
<MyCheckbox disabled labelText="Enable notifications" />
```

<CheckboxDemoCustom disabled labelText="Enable notifications" />

## HTML Forms

If you set the `name` prop, a hidden checkbox input will be rendered to submit the value of the checkbox with a form.

By default, the checkbox will be submitted with default checkbox value of `'on'` if the `checked` prop is `true`.

```svelte /name="notifications"/
<MyCheckbox name="notifications" labelText="Enable notifications" />
```

### Custom Input Value

If you'd prefer to submit a different value, you can use the `value` prop to set the value of the hidden input.

For example, if you wanted to submit a string value, you could do the following:

```svelte /value="hello"/
<MyCheckbox
  value="hello"
  name="notifications"
  labelText="Enable notifications"
/>
```

### Required

If you want to make the checkbox required, you can use the `required` prop.

```svelte /required/
<Checkbox.Root required>
  <!-- ... -->
</Checkbox.Root>
```

This will apply the `required` attribute to the hidden input element, ensuring that proper form submission is enforced.

## Checkbox Groups

You can use the `Checkbox.Group` component to create a checkbox group.

```svelte
<script lang="ts">
  import { Checkbox } from "bits-ui";
</script>

<Checkbox.Group name="notifications">
  <Checkbox.GroupLabel>Notifications</Checkbox.GroupLabel>
  <Checkbox.Root value="marketing" />
  <Checkbox.Root value="promotions" />
  <Checkbox.Root value="news" />
</Checkbox.Group>
```

<ComponentPreviewV2 name="checkbox-demo-group" componentName="Checkbox" containerClass="mt-6">

{#snippet preview()}
<CheckboxDemoGroup />
{/snippet}

</ComponentPreviewV2>

### Managing Value State

This section covers how to manage the `value` state of a Checkbox Group.

#### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Checkbox } from "bits-ui";
  let myValue = $state<string[]>([]);
</script>

<button
  onclick={() => {
    myValue = ["item-1", "item-2"];
  }}
>
  Open Items 1 and 2
</button>

<Checkbox.Group name="myItems" bind:value={myValue}>
  <Checkbox.GroupLabel>Items</Checkbox.GroupLabel>
  <Checkbox.Root value="item-1" />
  <Checkbox.Root value="item-2" />
  <Checkbox.Root value="item-3" />
</Checkbox.Group>
```

#### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Checkbox } from "bits-ui";
  let myValue = $state<string[]>([]);

  function getValue() {
    return myValue;
  }

  function setValue(newValue: string[]) {
    myValue = newValue;
  }
</script>

<Checkbox.Group bind:value={getValue, setValue}>
  <!-- ... -->
</Checkbox.Group>
```

### HTML Forms

To render hidden `<input />` elements for the various checkboxes within a group, pass a `name` to `Checkbox.Group`. All descendent checkboxes will then render hidden inputs with the same name.

```svelte /name="notifications"/
<Checkbox.Group name="notifications">
  <!-- ... -->
</Checkbox.Group>
```

When a `Checkbox.Group` component is used, its descendent `Checkbox.Root` components will use certain properties from the group, such as the `name`, `required`, and `disabled`.

<APISection {schemas} />
