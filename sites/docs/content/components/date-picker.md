---
title: Date Picker
description: Facilitates the selection of dates through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreviewV2, DatePickerDemo, Callout } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-picker-demo" comp="Date Picker">

{#snippet preview()}
<DatePickerDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Structure

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
</script>

<DatePicker.Root>
	<DatePicker.Label />
	<DatePicker.Input>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				<DatePicker.Segment {part}>
					{value}
				</DatePicker.Segment>
			{/each}
		{/snippet}
		<DatePicker.Trigger />
	</DatePicker.Input>
	<DatePicker.Content>
		<DatePicker.Calendar>
			{#snippet children({ months, weekdays })}
				<DatePicker.Header>
					<DatePicker.PrevButton />
					<DatePicker.Heading />
					<DatePicker.NextButton />
				</DatePicker.Header>
				{#each months as month}
					<DatePicker.Grid>
						<DatePicker.GridHead>
							<DatePicker.GridRow>
								{#each weekdays as day}
									<DatePicker.HeadCell>
										{day}
									</DatePicker.HeadCell>
								{/each}
							</DatePicker.GridRow>
						</DatePicker.GridHead>
						<DatePicker.GridBody>
							{#each month.weeks as weekDates}
								<DatePicker.GridRow>
									{#each weekDates as date}
										<DatePicker.Cell {date} month={month.value}>
											<DatePicker.Day />
										</DatePicker.Cell>
									{/each}
								</DatePicker.GridRow>
							{/each}
						</DatePicker.GridBody>
					</DatePicker.Grid>
				{/each}
			{/snippet}
		</DatePicker.Calendar>
	</DatePicker.Content>
</DatePicker.Root>
```

## Placeholder State

Bits UI provides flexible options for controlling and synchronizing the `DatePicker` component's placeholder state.

### Two-Way Binding

Use the `bind:placeholder` directive for effortless two-way synchronization between your local state and the `DatePicker` component's placeholder.

```svelte {3,6,8}
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let placeholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DatePicker.Root bind:placeholder>
	<!-- ... -->
</DatePicker.Root>
```

This setup enables toggling the `DatePicker` component's placeholder via the custom button and ensures the local `placeholder` state is synchronized with the component's placeholder state.

### Change Handler

You can also use the `onPlaceholderChange` prop to update local state when the `DatePicker` component's placeholder changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the component's placeholder changes.

```svelte {3,7-11}
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let placeholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DatePicker.Root
	bind:placeholder
	onPlaceholderChange={(placeholder) => {
		placeholder = placeholder.set({ year: 2025 });
	}}
>
	<!-- ... -->
</DatePicker.Root>
```

### Controlled

Sometimes, you may want complete control over the `DatePicker`'s `placeholder` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledPlaceholder` prop to `true`.

You will then be responsible for updating a local placeholder state variable that is passed as the `placeholder` prop to the `DatePicker.Root` component.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";

	let myPlaceholder = $state();
</script>

<DatePicker.Root
	controlledPlaceholder
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => (myPlaceholder = p)}
>
	<!-- ... -->
</DatePicker.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Value State

The `value` represents the currently selected date within the `DatePicker` component.

Bits UI provides flexible options for controlling and synchronizing the `DatePicker` component's value state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the `DateField` component's value.

```svelte {3,6,8}
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let value = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (value = value.add({ days: 1 }))}> Add 1 day </button>
<DatePicker.Root bind:value>
	<!-- ... -->
</DatePicker.Root>
```

This setup enables toggling the `DatePicker` component's value via the custom button and ensures the local `value` state is synchronized with the `DatePicker` component's value.

### Change Handler

You can also use the `onValueChange` prop to update local state when the `DatePicker` component's value changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the `DatePicker` component's value changes.

```svelte {3,7-11}
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let value = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DatePicker.Root
	bind:value
	onValueChange={(value) => {
		value = value.set({ hour: value.hour + 1 });
	}}
>
	<!-- ... -->
</DatePicker.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `value` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `DatePicker.Root` component.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";

	let myValue = $state();
</script>

<DatePicker.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</DatePicker.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Open State

The `open` prop is used to determine whether the `DatePicker` is open or closed. Bits UI provides flexible options for controlling and synchronizing the open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the `DatePicker`'s internal state.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let myOpen = $state(false);
</script>

<button onclick={() => (myOpen = true)}> Open </button>

<DatePicker.Root bind:open={myOpen}>
	<!-- ... -->
</DatePicker.Root>
```

This setup enables toggling the `DatePicker` via the custom button and ensures the local `myOpen` state updates when the state changes through any internal means (e.g., clicking on the trigger).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the `DatePicker`'s `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the state changes.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
	let myOpen = $state(false);
</script>

<DatePicker.Root
	open={myOpen}
	onOpenChange={(open) => {
		myOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</DatePicker.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `open` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you'll rarely need this, it's possible to do so by setting the `controlledOpen` prop to `true`.

You will then be responsible for updating a local state variable that is passed as the `open` prop to the `DatePicker.Root` component.

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";

	let myOpen = $state(false);
</script>

<DatePicker.Root controlledOpen open={myOpen} onOpenChange={(o) => (myOpen = o)}>
	<!-- ... -->
</DatePicker.Root>
```

<APISection {schemas} />
