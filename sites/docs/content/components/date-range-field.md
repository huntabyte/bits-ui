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

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Overview

The `DateRangeField` component combines two [Date Field](/docs/components/date-field) components to create a date range field. Check out the [Date Field](/docs/components/date-field) component documentation for information on how to customize this component.

## Structure

```svelte
<script lang="ts">
	import { DateRangeField } from "$lib";
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

## Managing Placeholder State

Bits UI offers several approaches to manage and synchronize the component's placeholder state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:placeholder` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangeField.Root bind:placeholder={myPlaceholder}>
	<!-- ... -->
</DateRangeField.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myPlaceholder` when the internal state changes
-   Allows external control (e.g., changing the placeholder via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onPlaceholderChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangeField.Root
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => {
		myPlaceholder = p.set({ year: 2025 });
	}}
>
	<!-- ... -->
</DateRangeField.Root>
```

#### Use Cases

-   Implementing custom behaviors on placeholder change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's placeholder state, use the `controlledPlaceholder` prop. This approach requires you to manually manage the state, giving you full control over when and how the component responds to change events.

To implement controlled state:

1. Set the `controlledPlaceholder` prop to `true` on the `DateRangeField.Root` component.
2. Provide a `placeholder` prop to `DateRangeField.Root`, which should be a variable holding the current state.
3. Implement an `onPlaceholderChange` handler to update the state when the internal state changes.

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

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

## Managing Value State

Bits UI offers several approaches to manage and synchronize the component's value state, catering to different levels of control and integration needs.

### 1. Two-Way Binding

For seamless state synchronization, use Svelte's `bind:value` directive. This method automatically keeps your local state in sync with the component's internal state.

```svelte {3,6,8}
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state({
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
<DateRangeField.Root bind:value={myValue}>
	<!-- ... -->
</DateRangeField.Root>
```

#### Key Benefits

-   Simplifies state management
-   Automatically updates `myValue` when the internal state changes
-   Allows external control (e.g., changing the value via a separate button/programmatically)

### 2. Change Handler

For more granular control or to perform additional logic on state changes, use the `onValueChange` prop. This approach is useful when you need to execute custom logic alongside state updates.

```svelte {3,7-11}
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	import { CalendarDateTime } from "@internationalized/date";
	let myValue = $state({
		start: new CalendarDateTime(2024, 8, 3, 12, 30),
		end: new CalendarDateTime(2024, 8, 4, 12, 30),
	});
</script>

<DateRangeField.Root
	value={myValue}
	onValueChange={(v) => {
		value = {
			start: v.start?.set({ hour: v.start.hour + 1 }),
			end: v.end?.set({ hour: v.end.hour + 1 }),
		};
	}}
>
	<!-- ... -->
</DateRangeField.Root>
```

#### Use Cases

-   Implementing custom behaviors on value change
-   Integrating with external state management solutions
-   Triggering side effects (e.g., logging, data fetching)

### 3. Fully Controlled

For complete control over the component's value state, use the `controlledValue` prop. This approach requires you to manually manage the state, giving you full control over when and how the component responds to change events.

To implement controlled state:

1. Set the `controlledValue` prop to `true` on the `DateRangeField.Root` component.
2. Provide a `value` prop to `DateRangeField.Root`, which should be a variable holding the current state.
3. Implement an `onValueChange` handler to update the state when the internal state changes.

```svelte
<script lang="ts">
	import { DateRangeField } from "bits-ui";
	let myValue = $state();
</script>

<DateRangeField.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</DateRangeField.Root>
```

#### When to Use

-   Implementing complex logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout>

While powerful, fully controlled state should be used judiciously as it increases complexity and can cause unexpected behaviors if not handled carefully.

For more in-depth information on controlled components and advanced state management techniques, refer to our [Controlled State](/docs/controlled-state) documentation.

</Callout>

<APISection {schemas} />
