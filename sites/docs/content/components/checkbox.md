---
title: Checkbox
description: Allow users to switch between checked, unchecked, and indeterminate states.
---

<script>
	import { APISection, ComponentPreviewV2, CheckboxDemo, CheckboxDemoCustom } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="checkbox-demo" comp="Checkbox">

{#snippet preview()}
<CheckboxDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Checkbox } from "bits-ui";
</script>

<Checkbox.Root>
	{#snippet children({ checked })}
		{#if checked === "indeterminate"}
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
	import { Checkbox, Label, useId, type WithoutChildrenOrChild } from "bits-ui";

	let {
		id = useId(),
		checked = $bindable(false),
		ref = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Checkbox.RootProps> & {
		labelText: string;
	} = $props();
</script>

<Checkbox.Root bind:checked bind:ref {...restProps}>
	{#snippet children({ checked })}
		{#if checked === "indeterminate"}
			-
		{:else if checked}
			✅
		{:else}
			❌
		{/if}
	{/snippet}
</Checkbox.Root>
<Label.Root for={id}>
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

The `checked` prop is used to determine whether the checkbox is in one of three states: checked, unchecked, or indeterminate. Bits UI provides flexible options for controlling and synchronizing the Checkbox's checked state.

### Two-Way Binding

Use the `bind:checked` directive for effortless two-way synchronization between your local state and the Checkbox's internal state.

```svelte
<script lang="ts">
	import MyCheckbox from "$lib/components/MyCheckbox.svelte";
	let myChecked = $state(false);
</script>

<button onclick={() => (myChecked = false)}> uncheck </button>

<MyCheckbox bind:checked={myChecked} />
```

This setup enables toggling the Checkbox via the custom button and ensures the local `myChecked` state updates when the Checkbox changes through any internal means (e.g., clicking on the checkbox).

### Change Handler

You can also use the `onCheckedChange` prop to update local state when the Checkbox's `checked` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Checkbox changes.

```svelte
<script lang="ts">
	import MyCheckbox from "$lib/components/MyCheckbox.svelte";
	let myChecked = $state(false);
</script>

<MyCheckbox
	checked={myChecked}
	onCheckedChange={(checked) => {
		myChecked = checked;
		if (checked === "indeterminate") {
			// do something different
		}
		// additional logic here.
	}}
/>
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
<MyCheckbox value="hello" name="notifications" labelText="Enable notifications" />
```

<APISection {schemas} />
