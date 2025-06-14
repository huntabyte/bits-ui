---
title: Date Range Field
description: Allows users to input a range of dates within a designated field.
---

<script>
	import { APISection, ComponentPreviewV2, DateRangeFieldDemo, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="date-range-field-demo" componentName="Date Range Field">

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

This section covers how to manage the `placeholder` state of the component.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

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

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangeField } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));

  function getPlaceholder() {
    return myPlaceholder;
  }

  function setPlaceholder(newPlaceholder: CalendarDateTime) {
    myPlaceholder = newPlaceholder;
  }
</script>

<DateRangeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</DateRangeField.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { DateRangeField, type DateRange } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state<DateRange>({
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

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangeField } from "bits-ui";
  let myValue = $state<DateRange>({
    start: undefined,
    end: undefined,
  });

  function getValue() {
    return myValue;
  }

  function setValue(newValue: DateRange) {
    myValue = newValue;
  }
</script>

<DateRangeField.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateRangeField.Root>
```

<APISection {schemas} />
