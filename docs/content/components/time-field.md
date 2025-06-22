---
title: Time Field
description: Enables users to input a time within a designated field.
---

<script>
	import { CalendarDateTime, CalendarDate, now, getLocalTimeZone, parseDateTime, today, Time } from "@internationalized/date";
	import { APISection, ComponentPreviewV2, TimeFieldDemo, TimeFieldDemoCustom, DemoContainer, Callout } from '$lib/components/index.js'
	import { toast } from 'svelte-sonner';
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="time-field-demo" componentName="Time Field">

{#snippet preview()}
<TimeFieldDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates/Times](/docs/dates) documentation to learn more!

</Callout>

## Overview

The `TimeField` component is an alternative to the native `<input type="time">` element. It provides a more flexible and customizable way to select times within a designated field.

## Structure

```svelte
<script lang="ts">
  import { TimeField } from "bits-ui";
</script>

<TimeField.Root>
  <TimeField.Label>Check-in time</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>
          {value}
        </TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

## Reusable Components

It's recommended to use the `TimeField` primitives to build your own custom time field component that can be used throughout your application.

The following example shows how you might create a reusable `MyTimeField` component that can be used throughout your application. For style inspiration, reference the featured demo at the top of this page.

```svelte title="MyTimeField.svelte"
<script lang="ts" module>
  import type { TimeValue } from "bits-ui";
  import type { Time } from "@internationalized/date";

  type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">
  import { TimeField, type WithoutChildrenOrChild } from "bits-ui";

  let {
    value = $bindable(),
    placeholder = $bindable(),
    labelText = "Select a time",
    ...restProps
  }: WithoutChildrenOrChild<TimeField.RootProps<T>> & {
    name?: string;
    labelText?: string;
  } = $props();
</script>

<TimeField.Root bind:value bind:placeholder {...restProps}>
  <TimeField.Label {name}>{labelText}</TimeField.Label>
  <TimeField.Input>
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <TimeField.Segment {part}>
          {value}
        </TimeField.Segment>
      {/each}
    {/snippet}
  </TimeField.Input>
</TimeField.Root>
```

<ComponentPreviewV2 size="xs" fileName="MyTimeField.svelte" containerClass="mt-4" name="time-field-demo-custom" componentName="TimeField">

{#snippet preview()}
<TimeFieldDemoCustom labelText="Select a time" />
{/snippet}

</ComponentPreviewV2>

We'll be using this newly created `MyTimeField` component in the following demos and examples to prevent repeating the same code, so be sure to reference it as you go through the documentation.

## Segments

A segment of the `TimeField` represents a not only a specific part of the time, such as the hour, minute, second, dayPeriod, or timeZoneName, but can also reference a `"literal"` which is typically a separator between the different parts of the time, and varies based on the `locale`.

Notice that in the `MyTimeField` component we created, we're styling the `TimeField.Segment` components differently based on whether they are a `"literal"` or not.

## Placeholder

The `placeholder` prop for the `TimeField.Root` component isn't what is displayed when the field is empty, but rather what time our field should start with when the user attempts to cycle through the segments.

By default, the `placeholder` will be set to `12:00 AM` or `00:00` depending on the hour cycle.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { Time } from "@internationalized/date";
</script>

<MyTimeField placeholder={new Time(12, 30)} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<TimeFieldDemoCustom placeholder={new Time(5, 30)} />
</DemoContainer>

If we're collecting a time from the user where we want the timezone to be displayed as well, we can use a `ZonedDateTime` object instead.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { now, getLocalTimeZone } from "@internationalized/date";
</script>

<MyTimeField placeholder={now("America/New_York")} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<TimeFieldDemoCustom placeholder={now("America/New_York")} />
</DemoContainer>

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the Time Field.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { TimeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myPlaceholder = $state(new Time(12, 30));
</script>

<button onclick={() => (myPlaceholder = new Time(12, 30))}>
  Set placeholder to 12:30 PM
</button>

<TimeField.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</TimeField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { TimeField, type TimeValue } from "bits-ui";
  let myPlaceholder = $state<TimeValue>();

  function getPlaceholder() {
    return myPlaceholder;
  }

  function setPlaceholder(newPlaceholder: TimeValue) {
    myPlaceholder = newPlaceholder;
  }
</script>

<TimeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</TimeField.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the Time Field. The `value` can be a `Time`, `CalendarDateTime`, or `ZonedDateTime` object, and the type in the `value`/`onValueChange` prop will be inferred based on the type of the `value` prop.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { TimeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myValue = $state(new Time(12, 30));
</script>

<button onclick={() => (myValue = myValue.add({ hours: 1 }))}>
  Add 1 hour
</button>
<TimeField.Root bind:value={myValue}>
  <!-- ... -->
</TimeField.Root>
```

### Fully Controlled

For complete control over the component's state, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) to manage the value state externally.

```svelte
<script lang="ts">
  import { TimeField, type TimeValue } from "bits-ui";
  let myValue = $state<TimeValue>();

  function getValue() {
    return myValue;
  }

  function setValue(newValue: TimeValue | undefined) {
    myValue = newValue;
  }
</script>

<DateField.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateField.Root>
```

## Default Value

Often, you'll want to start the `TimeField.Root` component with a default value. Likely this value will come from a database in the format of an ISO 8601 string. You can use the `parseDateTime` function from the `@internationalized/date` package to parse the string into a `CalendarDateTime` object.

```svelte title="+page.svelte"
<script lang="ts">
  import { TimeField } from "bits-ui";
  import { parseDateTime } from "@internationalized/date";

  // this came from a database/API call
  const date = "2024-08-03T15:15";

  let value = $state(parseDateTime(date));
</script>

<TimeField.Root {value}>
  <!-- ... -->
</TimeField.Root>
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<TimeFieldDemoCustom value={parseDateTime("2024-08-03T15:15")} />
</DemoContainer>

Now our input is populated with the default value. In addition to the `parseDateTime` function, you can also use `parseZonedDateTime` to parse the string into a `ZonedDateTime` object if you're working with a timezone.

## Validation

### Minimum Value

You can set a minimum value for the `TimeField.Root` component by using the `minValue` prop. If a user selects a time that is less than the minimum value, the time field will be marked as invalid.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { Time } from "@internationalized/date";
</script>

<MyTimeField minValue={new Time(9, 0)} value={new Time(8, 0)} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<TimeFieldDemoCustom minValue={new Time(9, 0)} value={new Time(8, 0)} />
</DemoContainer>

In the example above, we're setting the minimum value to 9:00 AM, and the default value to 8:00 AM. This causes the time field to be marked as invalid, and we can style it accordingly. If you adjust the time to be greater than the minimum value, the invalid state will be cleared.

### Maximum Value

You can set a maximum value for the `TimeField.Root` component by using the `maxValue` prop. If a user selects a time that is greater than the maximum value, the time field will be marked as invalid.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { Time } from "@internationalized/date";
</script>

<MyTimeField maxValue={new Time(17, 0)} value={new Time(18, 0)} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<TimeFieldDemoCustom maxValue={new Time(17, 0)} value={new Time(18, 0)} />
</DemoContainer>

In the example above, we're setting the maximum value to 5:00 PM, and the default value to 6:00 PM. This causes the time field to be marked as invalid, and we can style it accordingly. If you adjust the time to be less than the maximum value, the invalid state will be cleared.

### Custom Validation

You can use the `validate` prop to provide a custom validation function for the time field. This function should return a string or array of strings as validation errors if the time is invalid, or undefined/nothing if the time is valid.

The strings are then passed to the `onInvalid` callback, which you can use to display an error message to the user.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import type { TimeValue } from "bits-ui";
  import { Time } from "@internationalized/date";
  import { toast } from "your-favorite-toast-library";

  const value = new Time(12, 30);

  function validate(time: TimeValue) {
    return time.hour === 12 ? "Time cannot be 12:00 PM" : undefined;
  }

  function onInvalid(
    reason: "min" | "max" | "custom",
    msg?: string | string[]
  ) {
    if (reason === "custom") {
      if (typeof msg === "string") {
        // do something with the error message
        toast.error(msg);
        return;
      } else if (Array.isArray(msg)) {
        // do something with the error messages
        toast.error(msg.join(", "));
        return;
      }
      toast.error("The time is invalid");
    } else if (reason === "min") {
      // let the user know that the date is too early.
      toast.error("The time is too early.");
    } else if (reason === "max") {
      // let the user know that the date is too late.
      toast.error("The date is too late.");
    }
  }
</script>

<MyTimeField {validate} {value} {onInvalid} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<TimeFieldDemoCustom minValue={new Time(9, 0)} maxValue={new Time(17, 0)} value={new Time(11, 30)} validate={(time) => time.hour === 12 && time.minute === 0 ? "Time cannot be 12:00 PM" : undefined} onInvalid={(reason, msg) => {
		if (reason === "custom") {
			if (typeof msg === "string") {
				toast.error(msg);
				return;
			} else if (Array.isArray(msg)) {
				toast.error(msg.join(", "));
				return;
			}
			toast.error("The time is invalid");
		} else if (reason === "min") {
			toast.error("The time must be after 9:00 AM");
		} else if (reason === "max") {
			toast.error("The time must be before 5:00 PM");
		}
	}} />
</DemoContainer>

## Granularity

The `granularity` prop sets the granularity of the date field, which determines which segments are rendered in the date field. The `granularity` can be set to either `'hour'`, `'minute'`, or `'second'` and defaults to `'minute'`.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
  import { Time } from "@internationalized/date";

  const value = new Time(12, 30);
</script>

<MyTimeField granularity="second" {value} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<TimeFieldDemoCustom granularity="second" value={new Time(12, 30)} />
</DemoContainer>

In the example above, we're setting the granularity to `'second'`, which means that the time field will include an additional segment for the seconds.

## Localization

You can use the `locale` prop to set the locale of the date field. This will affect the formatting of the date field's segments and placeholders.

```svelte
<script lang="ts">
  import MyTimeField from "$lib/components/MyTimeField.svelte";
</script>

<MyTimeField locale="de" value={new Time(13, 30, 0)} />
```

<DemoContainer size="xs" wrapperClass="rounded-bl-card rounded-br-card">
	<TimeFieldDemoCustom locale="de" value={new Time(13, 30, 0)} />
</DemoContainer>

Notice how in the example above, the hour is displayed as `13` (in 24-hour format) and the day period is not displayed, since the locale is set to `de` (German).

<APISection {schemas} />
