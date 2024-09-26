---
title: Date Range Picker
description: Facilitates the selection of date ranges through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreviewV2, DateRangePickerDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-range-picker-demo" comp="Date Range Picker">

{#snippet preview()}
<DateRangePickerDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
</script>

<DateRangePicker.Root>
	<DateRangePicker.Label />
	{#each ["start", "end"] as const as type}
		<DateRangePicker.Input {type}>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<DateRangePicker.Segment {part}>
						{value}
					</DateRangePicker.Segment>
				{/each}
			{/snippet}
		</DateRangePicker.Input>
	{/each}
	<DateRangePicker.Trigger />
	<DateRangePicker.Content>
		<DateRangePicker.Calendar>
			{#snippet children({ months, weekdays })}
				<DateRangePicker.Header>
					<DateRangePicker.PrevButton />
					<DateRangePicker.Heading />
					<DateRangePicker.NextButton />
				</DateRangePicker.Header>
				{#each months as month}
					<DateRangePicker.Grid>
						<DateRangePicker.GridHead>
							<DateRangePicker.GridRow>
								{#each weekdays as day}
									<DateRangePicker.HeadCell>
										{day}
									</DateRangePicker.HeadCell>
								{/each}
							</DateRangePicker.GridRow>
						</DateRangePicker.GridHead>
						<DateRangePicker.GridBody>
							{#each month.weeks as weekDates}
								<DateRangePicker.GridRow>
									{#each weekDates as date}
										<DateRangePicker.Cell {date} month={month.value}>
											<DateRangePicker.Day>
												{date.day}
											</DateRangePicker.Day>
										</DateRangePicker.Cell>
									{/each}
								</DateRangePicker.GridRow>
							{/each}
						</DateRangePicker.GridBody>
					</DateRangePicker.Grid>
				{/each}
			{/snippet}
		</DateRangePicker.Calendar>
	</DateRangePicker.Content>
</DateRangePicker.Root>
```

## Placeholder State

Bits UI provides flexible options for controlling and synchronizing the `DateRangePicker` component's `placeholder` state.

### Two-Way Binding

Use the `bind:placeholder` directive for effortless two-way synchronization between your local state and the `DateRangePicker` component's placeholder.

```svelte {3,6,8}
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let placeholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangePicker.Root bind:placeholder>
	<!-- ... -->
</DateField.Root>
```

This setup enables toggling the `DateRangePicker` component's placeholder via the custom button and ensures the local `placeholder` state is synchronized with the `DateRangePicker` component's placeholder should it change from within the component.

### Change Handler

You can also use the `onPlaceholderChange` prop to update local state when the component's `placeholder` changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the `DateRangePicker` component's placeholder changes.

```svelte {3,7-11}
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let placeholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangePicker.Root
	bind:placeholder
	onPlaceholderChange={(p) => {
		placeholder = placeholder.set({ year: 2025 });
	}}
>
	<!-- ... -->
</DateRangePicker.Root>
```

### Controlled

Sometimes, you may want complete control over the `placeholder` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledPlaceholder` prop to `true`.

You will then be responsible for updating a local placeholder state variable that is passed as the `placeholder` prop to the `DateRangePicker.Root` component.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myPlaceholder = $state();
</script>

<DateRangePicker.Root
	controlledPlaceholder
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => (myPlaceholder = p)}
>
	<!-- ... -->
</DateRangePicker.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Value State

The `value` represents the currently selected date within the `DateRangePicker` component.

Bits UI provides flexible options for controlling and synchronizing the `DateRangePicker` component's value state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the `DateRangePicker` component's value.

```svelte {3,6,8}
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
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
<DateRangePicker.Root bind:value>
	<!-- ... -->
</DateRangePicker.Root>
```

This setup enables toggling the component's value via the custom button and ensures the local `value` state is synchronized with the component's value, should it change from within the component.

### Change Handler

You can also use the `onValueChange` prop to update local state when the component's value changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the component's value changes.

```svelte {3,7-11}
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let value = $state({
		start: new CalendarDateTime(2024, 8, 3, 12, 30),
		end: new CalendarDateTime(2024, 8, 4, 12, 30),
	});
</script>

<DateRangePicker.Root
	bind:value
	onValueChange={(v) => {
		value = {
			start: v.start.set({ hour: v.start.hour + 1 }),
			end: v.end.set({ hour: v.end.hour + 1 }),
		};
	}}
>
	<!-- ... -->
</DateRangePicker.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `value` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `DateRangePicker.Root` component.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myValue = $state();
</script>

<DateRangePicker.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</DateRangePicker.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Open State

The `open` prop is used to determine whether the `DateRangePicker` is open or closed. Bits UI provides flexible options for controlling and synchronizing the open state.

### Two-Way Binding

Use the `bind:open` directive for effortless two-way synchronization between your local state and the `DateRangePicker`'s internal state.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myOpen = $state(false);
</script>

<button onclick={() => (myOpen = true)}> Open </button>

<DateRangePicker.Root bind:open={myOpen}>
	<!-- ... -->
</DateRangePicker.Root>
```

This setup enables toggling the `DateRangePicker` via the custom button and ensures the local `myOpen` state updates when the state changes through any internal means (e.g., clicking on the trigger).

### Change Handler

You can also use the `onOpenChange` prop to update local state when the `DateRangePicker`'s `open` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the state changes.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myOpen = $state(false);
</script>

<DateRangePicker.Root
	open={myOpen}
	onOpenChange={(open) => {
		myOpen = open;
		// additional logic here.
	}}
>
	<!-- ... -->
</DateRangePicker.Root>
```

### Controlled

Sometimes, you may want complete control over the component's `open` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you'll rarely need this, it's possible to do so by setting the `controlledOpen` prop to `true`.

You will then be responsible for updating a local state variable that is passed as the `open` prop to the `DateRangePicker.Root` component.

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
	let myOpen = $state(false);
</script>

<DateRangePicker.Root controlledOpen open={myOpen} onOpenChange={(o) => (myOpen = o)}>
	<!-- ... -->
</DateRangePicker.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

<APISection {schemas} />
