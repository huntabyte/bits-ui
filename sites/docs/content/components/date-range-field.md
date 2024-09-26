---
title: Date Range Field
description: Allows users to input a range of dates within a designated field.
---

<script>
	import { APISection, ComponentPreviewV2, DateRangeFieldDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-range-field-demo" comp="Date Range Field">

{#snippet preview()}
<DateRangeFieldDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { DateField } from "$lib";
</script>

<DateRangeField.Root>
	<DateRangeField.Label>Check-in date</DateRangeField.Label>
	{#each ["start", "end"] as const as type}
		<DateRangeField.Input {type}>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<DateRangeField.Segment {part}>
						{value}
					</DateRangeField.Segment>
				{/each}
			{/snippet}
		</DateRangeField.Input>
	{/each}
</DateRangeField.Root>
```

<Callout type="warning" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Placeholder State

Bits UI provides flexible options for controlling and synchronizing the `DateRangeField` component's `placeholder` state.

### Two-Way Binding

Use the `bind:placeholder` directive for effortless two-way synchronization between your local state and the `DateRangeField` component's placeholder.

```svelte {3,6,8}
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	let placeholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangeField.Root bind:placeholder>
	<!-- ... -->
</DateField.Root>
```

This setup enables toggling the `DateRangeField` component's placeholder via the custom button and ensures the local `placeholder` state is synchronized with the `DateRangeField` component's placeholder should it change from within the component.

### Change Handler

You can also use the `onPlaceholderChange` prop to update local state when the component's `placeholder` changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the `DateRangeField` component's placeholder changes.

```svelte {3,7-11}
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	let placeholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangeField.Root
	bind:placeholder
	onPlaceholderChange={(p) => {
		placeholder = placeholder.set({ year: 2025 });
	}}
>
	<!-- ... -->
</DateRangeField.Root>
```

### Controlled

Sometimes, you may want complete control over the `placeholder` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledPlaceholder` prop to `true`.

You will then be responsible for updating a local placeholder state variable that is passed as the `placeholder` prop to the `DateRangeField.Root` component.

```svelte
<script lang="ts">
	import { DateRangeField } from "bits-ui";

	let myPlaceholder = $state();
</script>

<DateRangeField.Root
	controlledPlaceholder
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => (myPlaceholder = p)}
>
	<!-- ... -->
</DateRangeField.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Value State

The `value` represents the currently selected date within the `DateRangeField` component.

Bits UI provides flexible options for controlling and synchronizing the `DateRangeField` component's value state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the `DateRangeField` component's value.

```svelte {3,6,8}
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	let value = $state({
		start: new CalendarDateTime(2024, 8, 3, 12, 30),
		end: new CalendarDateTime(2024, 8, 4, 12, 30),
	});
</script>

<button
	onclick={() => {
		value = {
			start: value.start.add({ days: 1 }),
			end: value.end.add({ days: 1 }),
		};
	}}
>
	Add 1 day
</button>
<DateRangeField.Root bind:value>
	<!-- ... -->
</DateRangeField.Root>
```

This setup enables toggling the component's value via the custom button and ensures the local `value` state is synchronized with the component's value, should it change from within the component.

### Change Handler

You can also use the `onValueChange` prop to update local state when the component's value changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the component's value changes.

```svelte {3,7-11}
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	let value = $state({
		start: new CalendarDateTime(2024, 8, 3, 12, 30),
		end: new CalendarDateTime(2024, 8, 4, 12, 30),
	});
</script>

<DateRangeField.Root
	bind:value
	onValueChange={(v) => {
		value = {
			start: v.start.set({ hour: v.start.hour + 1 }),
			end: v.end.set({ hour: v.end.hour + 1 }),
		};
	}}
>
	<!-- ... -->
</DateRangeField.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `value` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `DateRangeField.Root` component.

```svelte
<script lang="ts">
	import { DateRangeField } from "bits-ui";

	let myValue = $state();
</script>

<DateRangeField.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</DateRangeField.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

<APISection {schemas} />
