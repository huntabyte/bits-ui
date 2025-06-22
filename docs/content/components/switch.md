---
title: Switch
description: A toggle control enabling users to switch between "on" and "off" states.
---

<script>
	import { APISection, ComponentPreviewV2, SwitchDemo, SwitchDemoCustom, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="switch-demo" componentName="Switch">

{#snippet preview()}
<SwitchDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Switch component provides an intuitive and accessible toggle control, allowing users to switch between two states, typically "on" and "off". This component is commonly used for enabling or disabling features, toggling settings, or representing boolean values in forms. The Switch offers a more visual and interactive alternative to traditional checkboxes for binary choices.

## Key Features

- **Accessibility**: Built with WAI-ARIA guidelines in mind, ensuring keyboard navigation and screen reader support.
- **State Management**: Internally manages the on/off state, with options for controlled and uncontrolled usage.
- **Style-able**: Data attributes allow for smooth transitions between states and custom styles.
- **HTML Forms**: Can render a hidden input element for form submissions.

## Architecture

The Switch component is composed of two main parts:

- **Root**: The main container component that manages the state and behavior of the switch.
- **Thumb**: The "movable" part of the switch that indicates the current state.

## Structure

Here's an overview of how the Switch component is structured in code:

```svelte
<script lang="ts">
  import { Switch } from "bits-ui";
</script>

<Switch.Root>
  <Switch.Thumb />
</Switch.Root>
```

## Reusable Components

It's recommended to use the `Switch` primitives to create your own custom switch component that can be used throughout your application.

In the example below, we're using the `Checkbox` and [`Label`](/docs/components/label) components to create a custom switch component.

```svelte title="MySwitch.svelte"
<script lang="ts">
  import { Switch, Label, useId, type WithoutChildrenOrChild } from "bits-ui";

  let {
    id = useId(),
    checked = $bindable(false),
    ref = $bindable(null),
    ...restProps
  }: WithoutChildrenOrChild<Switch.RootProps> & {
    labelText: string;
  } = $props();
</script>

<Switch.Root bind:checked bind:ref {id} {...restProps}>
  <Switch.Thumb />
</Switch.Root>
<Label.Root for={id}>{labelText}</Label.Root>
```

You can then use the `MySwitch` component in your application like so:

```svelte
<script lang="ts">
  import MySwitch from "$lib/components/MySwitch.svelte";

  let notifications = $state(true);
</script>

<MySwitch bind:checked={notifications} labelText="Enable notifications" />
```

## Managing Checked State

This section covers how to manage the `checked` state of the component.

### Two-Way Binding

Use `bind:checked` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { Switch } from "bits-ui";
  let myChecked = $state(true);
</script>

<button onclick={() => (myChecked = false)}> uncheck </button>

<Switch.Root bind:checked={myChecked} />
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Switch } from "bits-ui";
  let myChecked = $state(false);

  function getChecked() {
    return myChecked;
  }

  function setChecked(newChecked: boolean) {
    myChecked = newChecked;
  }
</script>

<Switch.Root bind:checked={getChecked, setChecked}>
  <!-- ... -->
</Switch.Root>
```

## Disabled State

You can disable the switch by setting the `disabled` prop to `true`.

```svelte /disabled/
<Switch.Root disabled>
  <!-- ...-->
</Switch.Root>
```

<SwitchDemoCustom disabled labelText="Do not disturb" />

## HTML Forms

If you pass the `name` prop to `Switch.Root`, a hidden input element will be rendered to submit the value of the switch to a form.

By default, the input will be submitted with the default checkbox value of `'on'` if the switch is checked.

```svelte /name="dnd"/
<Switch.Root name="dnd">
  <!-- ... -->
</Switch.Root>
```

### Custom Input Value

If you'd prefer to submit a different value, you can use the `value` prop to set the value of the hidden input.

For example, if you wanted to submit a string value, you could do the following:

```svelte /value="hello"/
<Switch.Root name="dnd" value="hello">
  <!-- ... -->
  <Switch.Thumb />
</Switch.Root>
```

### Required

If you want to make the switch required, you can use the `required` prop.

```svelte /required/
<Switch.Root required>
  <!-- ... -->
</Switch.Root>
```

This will apply the `required` attribute to the hidden input element, ensuring that proper form submission is enforced.

<APISection {schemas} />
