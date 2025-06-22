---
title: Date Picker
description: Facilitates the selection of dates through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreviewV2, DatePickerDemo, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="date-picker-demo" componentName="Date Picker">

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
      <DatePicker.Trigger />
    {/snippet}
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

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the component.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state();
</script>

<button
  onclick={() => {
    myPlaceholder = new CalendarDateTime(2024, 8, 3, 12, 30);
  }}
>
  Set placeholder to August 3rd, 2024
</button>

<DatePicker.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</DatePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myPlaceholder = $state<DateValue>();

  function getPlaceholder() {
    return myPlaceholder;
  }

  function setPlaceholder(newPlaceholder: DateValue) {
    myPlaceholder = newPlaceholder;
  }
</script>

<DatePicker.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</DatePicker.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myValue = myValue.add({ days: 1 }))}>
  Add 1 day
</button>
<DatePicker.Root bind:value={myValue}>
  <!-- ... -->
</DatePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myValue = $state<DateValue>();

  function getValue() {
    return myValue;
  }

  function setValue(newValue: DateValue) {
    myValue = newValue;
  }
</script>

<DatePicker.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DatePicker.Root>
```

## Managing Open State

This section covers how to manage the `open` state of the component.

### Two-Way Binding

Use `bind:open` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  let isOpen = $state(false);
</script>

<button onclick={() => (isOpen = true)}>Open DatePicker</button>

<DatePicker.Root bind:open={isOpen}>
  <!-- ... -->
</DatePicker.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { DatePicker } from "bits-ui";
  let myOpen = $state(false);

  function getOpen() {
    return myOpen;
  }

  function setOpen(newOpen: boolean) {
    myOpen = newOpen;
  }
</script>

<DatePicker.Root bind:open={getOpen, setOpen}>
  <!-- ... -->
</DatePicker.Root>
```

## Customization

The `DatePicker` component is made up of three other Bits UI components: [Date Field](/docs/components/date-field), [Calendar](/docs/components/calendar), and [Popover](/docs/components/popover).

You can check out the documentation for each of these components to learn more about their customization options, each of which can be used to customize the `DatePicker` component.

<APISection {schemas} />
