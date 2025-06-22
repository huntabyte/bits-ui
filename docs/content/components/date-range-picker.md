---
title: Date Range Picker
description: Facilitates the selection of date ranges through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreviewV2, DateRangePickerDemo, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="date-range-picker-demo" componentName="Date Range Picker">

{#snippet preview()}
<DateRangePickerDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

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

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the component.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<DateRangePicker.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</DateRangePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myPlaceholder = $state<DateValue>();

  function getPlaceholder() {
    return myPlaceholder;
  }

  function setPlaceholder(newPlaceholder: DateValue) {
    myPlaceholder = newPlaceholder;
  }
</script>

<DateRangePicker.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</DateRangePicker.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
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
<DateRangePicker.Root bind:value={myValue}>
  <!-- ... -->
</DateRangePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangePicker, type DateRange } from "bits-ui";
  let myValue = $state<DateRange>();

  function getValue() {
    return myValue;
  }

  function setValue(newValue: DateRange) {
    myValue = newValue;
  }
</script>

<DateRangePicker.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateRangePicker.Root>
```

## Managing Open State

This section covers how to manage the `open` state of the component.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open DateRangePicker</button>

<DateRangePicker.Root bind:open={isOpen}>
  <!-- ... -->
</DateRangePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DateRangePicker } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<DateRangePicker.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</DateRangePicker.Root>
```

## Customization

The `DateRangePicker` component is made up of three other Bits UI components: [Date Range Field](/docs/components/date-range-field), [Range Calendar](/docs/components/range-calendar), and [Popover](/docs/components/popover).

You can check out the documentation for each of these components to learn more about their customization options, each of which can be used to customize the `DateRangePicker` component.

<APISection {schemas} />
