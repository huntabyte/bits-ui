---
title: Date Field
description: Enables users to input specific dates within a designated field.
---

<script>
	import { CalendarDateTime, CalendarDate, now, getLocalTimeZone, parseDate, today } from "@internationalized/date";
	import { APISection, ComponentPreviewV2, DateFieldDemo, DateFieldDemoCustom, DemoContainer } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-field-demo" comp="Date Field">

{#snippet preview()}
<DateFieldDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The `DateField` component is an alternative to the native `<input type="date">` element. It provides a more flexible and customizable way to select dates within a designated field.

Before jumping into the `DateField` component, it's important to understand how dates and times are handled in Bits UI. You can learn more about this on the [Dates](/docs/dates) page.

## Structure

```svelte
<script lang="ts">
	import { DateField } from "$lib";
</script>

<DateField.Root>
	<DateField.Label>Check-in date</DateField.Label>
	<DateField.Input>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				<DateField.Segment {part}>
					{value}
				</DateField.Segment>
			{/each}
		{/snippet}
	</DateField.Input>
</DateField.Root>
```

## Reusable Components

It's recommended to use the `DateField` primitives to build your own custom date field component that can be used throughout your application.

The following example shows how you might create a reusable `MyDateField` component that can be used throughout your application. For style inspiration, reference the featured demo at the top of this page.

```svelte title="MyDateField.svelte"
<script lang="ts">
	import { DateField, type WithoutChildrenOrChild } from "bits-ui";

	type Props = WithoutChildrenOrChild<DateField.RootProps> & {
		labelText: string;
	};

	let { value, placeholder, name, ...restProps }: Props = $props();
</script>

<DateField.Root bind:value bind:placeholder {name} {...restProps}>
	<DateField.Label>{labelText}</DateField.Label>
	<DateField.Input>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				<DateField.Segment {part}>
					{value}
				</DateField.Segment>
			{/each}
		{/snippet}
	</DateField.Input>
</DateField.Root>
```

<ComponentPreviewV2 size="xs" fileName="MyDateField.svelte" containerClass="mt-4" name="date-field-demo-custom" comp="DateField">

{#snippet preview()}
<DateFieldDemoCustom labelText="Select a date" />
{/snippet}

</ComponentPreviewV2>

We'll be using this newly created `MyDateField` component in the following demos and examples to prevent repeating the same code, so be sure to reference it as you go through the documentation.

## Segments

A segment of the `DateField` represents a not only a specific part of the date, such as the day, month, year, hour, but can also reference a `"literal"` which is typically a separator between the different parts of the date, and varies based on the `locale`.

Notice that in the `MyDateField` component we created, we're styling the `DateField.Segment` components differently based on whether they are a `"literal"` or not.

## Placeholder

The `placeholder` prop for the `DateField.Root` component isn't what is displayed when the field is empty, but rather what date our field should start with when the user attempts to cycle through the segments. The placeholder can also be used to set a granularity for the date field, which will determine which type of `DateValue` object is used for the `value`.

By default, the `placeholder` will be set to the current date, and be of type `CalendarDate`. However, if we wanted this date field to also allow for selecting a time, we could set the placeholder to a `CalendarDateTime` object.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { CalendarDateTime } from "@internationalized/date";
</script>

<MyDateField placeholder={new CalendarDateTime(2024, 8, 3, 12, 30)} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom placeholder={new CalendarDateTime(2024, 8, 3, 12, 30)} />
</DemoContainer>

If we're collecting a date from the user where we want the timezone as well, we can use a `ZonedDateTime` object instead.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { now, getLocalTimeZone } from "@internationalized/date";
</script>

<MyDateField placeholder={now("America/New_York")} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom placeholder={now("America/New_York")} />
</DemoContainer>

NOTE: If you're creating a date field for something like a birthday, ensure your placeholder is set in a leap year to ensure users born on a leap year will be able to select the correct date.

## Placeholder State

Bits UI provides flexible options for controlling and synchronizing the `DateField.Root` component's placeholder state.

### Two-Way Binding

Use the `bind:placeholder` directive for effortless two-way synchronization between your local state and the `DateField.Root` component's placeholder.

```svelte {3,6,8}
<script lang="ts">
	import { DateField } from "bits-ui";
	let placeholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateField.Root bind:placeholder>
	<!-- ... -->
</DateField.Root>
```

This setup enables toggling the `DateField.Root` component's placeholder via the custom button and ensures the local `placeholder` state is synchronized with the `DateField.Root` component's placeholder.

### Change Handler

You can also use the `onPlaceholderChange` prop to update local state when the `DateField.Root` component's placeholder changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the `DateField.Root` component's placeholder changes.

```svelte {3,7-11}
<script lang="ts">
	import { DateField } from "bits-ui";
	let placeholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateField.Root
	bind:placeholder
	onPlaceholderChange={(placeholder) => {
		placeholder = placeholder.set({ year: 2025 });
	}}
>
	<!-- ... -->
</DateField.Root>
```

### Controlled

Sometimes, you may want complete control over the date field's `placeholder` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledPlaceholder` prop to `true`.

You will then be responsible for updating a local placeholder state variable that is passed as the `placeholder` prop to the `DateField.Root` component.

```svelte
<script lang="ts">
	import { DateField } from "bits-ui";

	let myPlaceholder = $state();
</script>

<DateField.Root
	controlledPlaceholder
	placeholder={myPlaceholder}
	onPlaceholderChange={(p) => (myPlaceholder = p)}
>
	<!-- ... -->
</DateField.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Value State

The `value` represents the currently selected date within the `DateField.Root` component.

Bits UI provides flexible options for controlling and synchronizing the `DateField.Root` component's value state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the `DateField.Root` component's value.

```svelte {3,6,8}
<script lang="ts">
	import { DateField } from "bits-ui";
	let value = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (value = value.add({ days: 1 }))}> Add 1 day </button>
<DateField.Root bind:value>
	<!-- ... -->
</DateField.Root>
```

This setup enables toggling the `DateField.Root` component's value via the custom button and ensures the local `value` state is synchronized with the `DateField.Root` component's value.

### Change Handler

You can also use the `onValueChange` prop to update local state when the `DateField.Root` component's value changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the `DateField.Root` component's value changes.

```svelte {3,7-11}
<script lang="ts">
	import { DateField } from "bits-ui";
	let value = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateField.Root
	bind:value
	onValueChange={(value) => {
		value = value.set({ hour: value.hour + 1 });
	}}
>
	<!-- ... -->
</DateField.Root>
```

### Controlled

Sometimes, you may want complete control over the date field's `value` state, meaning you will be "kept in the loop" and be required to apply the state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `DateField.Root` component.

```svelte
<script lang="ts">
	import { DateField } from "bits-ui";

	let myValue = $state();
</script>

<DateField.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</DateField.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled states.

## Default Value

Often, you'll want to start the `DateField.Root` component with a default value. Likely this value will come from a database in the format of an ISO 8601 string. You can use the `parseDate` function from the `@internationalized/date` package to parse the string into a `CalendarDate` object.

```svelte title="+page.svelte"
<script lang="ts">
	import { DateField } from "bits-ui";
	import { parseDate } from "@internationalized/date";

	const date = "2024-08-03";

	let value = $state(parseDate(date));
</script>

<MyDateField {value} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom value={parseDate("2024-08-03")} />
</DemoContainer>

Now our input is populated with the default value. In addition to the `parseDate` function, you can also use `parseDateTime` or `parseZonedDateTime` to parse the string into a `CalendarDateTime` or `ZonedDateTime` object respectively.

## Validation

### Minimum Value

You can set a minimum value for the `DateField.Root` component by using the `minValue` prop. If a user selects a date that is less than the minimum value, the date field will be marked as invalid.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { today, getLocalTimeZone } from "@internationalized/date";

	const todayDate = today(getLocalTimeZone());
	const yesterday = todayDate.subtract({ days: 1 });
</script>

<MyDateField minValue={todayDate} value={yesterday} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom minValue={today(getLocalTimeZone())} value={today(getLocalTimeZone()).subtract({ days: 1 })} />
</DemoContainer>

In the example above, we're setting the minimum value to today, and the default value to yesterday. This causes the date field to be marked as invalid, and we can style it accordingly. If you adjust the date to be greater than the minimum value, the invalid state will be cleared.

### Maximum Value

You can set a maximum value for the `DateField.Root` component by using the `maxValue` prop. If a user selects a date that is greater than the maximum value, the date field will be marked as invalid.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { today, getLocalTimeZone } from "@internationalized/date";

	const todayDate = today(getLocalTimeZone());
	const tomorrow = todayDate.add({ days: 1 });
</script>

<MyDateField maxValue={todayDate} value={tomorrow} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom maxValue={today(getLocalTimeZone())} value={today(getLocalTimeZone()).add({ days: 1 })} />
</DemoContainer>

In the example above, we're setting the maximum value to today, and the default value to tomorrow. This causes the date field to be marked as invalid, and we can style it accordingly. If you adjust the date to be less than the maximum value, the invalid state will be cleared.

### Unavailable Dates

You can specify speciifc dates that are unavailable for selection by using the `isDateUnavailable` prop. This prop accepts a function that returns a boolean value indicating whether a date is unavailable or not.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { CalendarDate, type DateValue } from "@internationalized/date";

	const value = new CalendarDate(2024, 8, 2);

	function isDateUnavailable(date: DateValue) {
		return date.day === 1;
	}
</script>

<MyDateField {isDateUnavailable} {value} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom isDateUnavailable={(date) => date.day === 1} value={new CalendarDate(2024, 8, 2)} />
</DemoContainer>

In the example above, we're setting the `isDateUnavailable` prop to a function that returns `true` for the first day of the month. Try selecting a date that is the first day of the month to see the date field marked as invalid.

## Granularity

The `granularity` prop sets the granularity of the date field, which determines which segments are rendered in the date field. The `granularity` can be set to either `'day'`, `'hour'`, `'minute'`, or `'second'`.

```svelte
<script lang="ts">
	import MyDateField from "$lib/components/MyDateField.svelte";
	import { CalendarDate } from "@internationalized/date";

	const value = new CalendarDateTime(2024, 8, 2, 12, 30);
</script>

<MyDateField granularity="second" {value} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<DateFieldDemoCustom granularity="second" value={new CalendarDateTime(2024, 8, 2, 12, 30)} />
</DemoContainer>

In the example above, we're setting the granularity to `'second'`, which means that the date field will include an additional segment for the seconds.

<APISection {schemas} />
