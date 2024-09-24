---
title: Switch
description: A toggle control enabling users to switch between "on" and "off" states.
---

<script>
	import { APISection, ComponentPreviewV2, SwitchDemo, SwitchDemoCustom } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="switch-demo" comp="Switch">

{#snippet preview()}
<SwitchDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

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

The `checked` prop is used to determine whether the switch is in one of two states: checked and unchecked.

### Two-Way Binding

Use the `bind:checked` directive for two-way synchronization between your local state and the switch's internal state.

```svelte
<script lang="ts">
	import { Switch } from "bits-ui";

	let myChecked = $state(false);

	function fetchNotifications() {
		// whatever logic would result in the `myChecked` state being updated
		myChecked = true;
	}
</script>

<button onclick={fetchNotifications}> Sync Notifications </button>

<Switch.Root bind:checked={myChecked}>
	<!-- ...-->
</Switch.Root>
```

This setup enables toggling the switch via custom logic and ensures the local `myChecked` state updates when the switch changes through any internal means (e.g. clicking on the switch).

### Change Handler

You can also use the `onCheckedChange` prop to update local state when the switch's checked state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform an additional side-effect when the switch's `checked` state changes.

```svelte
<Switch.Root onCheckedChange={(checked) => console.log(checked)}>
	<!-- ...-->
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

By default, the checkbox will be submitted with the default checkbox value of `'on'` if the switch is checked.

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

<APISection {schemas} />
