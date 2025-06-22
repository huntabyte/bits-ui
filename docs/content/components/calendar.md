---
title: Calendar
description: Displays dates and days of the week, facilitating date-related interactions.
---

<script>
	import { APISection, ComponentPreviewV2, CalendarDemo, CalendarDemoSelects, CalendarDemoPresets, Callout, CalendarDemoMax } from '$lib/components'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="calendar-demo" componentName="Calendar">

{#snippet preview()}
<CalendarDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Structure

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
</script>

<Calendar.Root>
  {#snippet children({ months, weekdays })}
    <Calendar.Header>
      <Calendar.PrevButton />
      <Calendar.Heading />
      <Calendar.NextButton />
    </Calendar.Header>

    {#each months as month}
      <Calendar.Grid>
        <Calendar.GridHead>
          <Calendar.GridRow>
            {#each weekdays as day}
              <Calendar.HeadCell>
                {day}
              </Calendar.HeadCell>
            {/each}
          </Calendar.GridRow>
        </Calendar.GridHead>
        <Calendar.GridBody>
          {#each month.weeks as weekDates}
            <Calendar.GridRow>
              {#each weekDates as date}
                <Calendar.Cell {date} month={month.value}>
                  <Calendar.Day />
                </Calendar.Cell>
              {/each}
            </Calendar.GridRow>
          {/each}
        </Calendar.GridBody>
      </Calendar.Grid>
    {/each}
  {/snippet}
</Calendar.Root>
```

## Placeholder

The `placeholder` prop for the `Calendar.Root` component determines what date our calendar should start with when the user hasn't selected a date yet. It also determines the current "view" of the calendar.

As the user navigates through the calendar, the `placeholder` will be updated to reflect the currently focused date in that view.

By default, the `placeholder` will be set to the current date, and be of type `CalendarDate`.

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the Calendar.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myPlaceholder = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myPlaceholder = new CalendarDate(2024, 8, 3))}>
  Set placeholder to August 3rd, 2024
</button>

<Calendar.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</Calendar.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import type { DateValue } from "@internationalized/date";

  let myPlaceholder = $state<DateValue>();

  function getPlaceholder() {
    return myPlaceholder;
  }

  function setPlaceholder(newPlaceholder: DateValue) {
    myPlaceholder = newPlaceholder;
  }
</script>

<Calendar.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</Calendar.Root>
```

See the [State Management](/docs/state-management) documentation for more information.

## Managing Value State

This section covers how to manage the `value` state of the Calendar.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { CalendarDateTime } from "@internationalized/date";
  let myValue = $state(new CalendarDateTime(2024, 8, 3, 12, 30));
</script>

<button onclick={() => (myValue = myValue.add({ days: 1 }))}>
  Add 1 day
</button>
<Calendar.Root type="single" bind:value={myValue}>
  <!-- ... -->
</Calendar.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import type { DateValue } from "@internationalized/date";
  let myValue = $state();

  function getValue() {
    return myValue;
  }

  function setValue(newValue: DateValue) {
    myValue = newValue;
  }
</script>

<Calendar.Root type="single" bind:value={getValue, setValue}>
  <!-- ... -->
</Calendar.Root>
```

See the [State Management](/docs/state-management) documentation for more information.

## Default Value

Often, you'll want to start the `Calendar.Root` component with a default value. Likely this value will come from a database in the format of an ISO 8601 string.

You can use the `parseDate` function from the `@internationalized/date` package to parse the string into a `CalendarDate` object.

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { parseDate } from "@internationalized/date";

  // this came from a database/API call
  const date = "2024-08-03";

  let value = $state(parseDate(date));
</script>

<Calendar.Root {value}>
  <!-- ...-->
</Calendar.Root>
```

## Validation

### Minimum Value

You can set a minimum value for the calendar by using the `minValue` prop on `Calendar.Root`. If a user selects a date that is less than the minimum value, the calendar will be marked as invalid.

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone } from "@internationalized/date";

  const todayDate = today(getLocalTimeZone());
  const yesterday = todayDate.subtract({ days: 1 });
</script>

<Calendar.Root minValue={todayDate} value={yesterday}>
  <!-- ...-->
</Calendar.Root>
```

### Maximum Value

You can set a maximum value for the calendar by using the `maxValue` prop on `Calendar.Root`. If a user selects a date that is greater than the maximum value, the calendar will be marked as invalid.

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone } from "@internationalized/date";

  const todayDate = today(getLocalTimeZone());
  const tomorrow = todayDate.add({ days: 1 });
</script>

<Calendar.Root maxValue={todayDate} value={tomorrow}>
  <!-- ...-->
</Calendar.Root>
```

### Unavailable Dates

You can specify specific dates that are unavailable for selection by using the `isDateUnavailable` prop. This prop accepts a function that returns a boolean value indicating whether a date is unavailable or not.

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone, isNotNull } from "@internationalized/date";

  const todayDate = today(getLocalTimeZone());
  const tomorrow = todayDate.add({ days: 1 });

  function isDateUnavailable(date: DateValue) {
    return date.day === 1;
  }
</script>

<Calendar.Root {isDateUnavailable} value={tomorrow}>
  <!-- ...-->
</Calendar.Root>
```

### Disabled Dates

You can specify specific dates that are disabled for selection by using the `isDateDisabled` prop.

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { today, getLocalTimeZone, isNotNull } from "@internationalized/date";

  const todayDate = today(getLocalTimeZone());
  const tomorrow = todayDate.add({ days: 1 });

  function isDateDisabled(date: DateValue) {
    return date.day === 1;
  }
</script>

<Calendar.Root {isDateDisabled} value={tomorrow}>
  <!-- ...-->
</Calendar.Root>
```

### Max Days

You can set the `maxDays` prop to limit the maximum number of days that can be selected when the calendar is `'multiple'` type.

```svelte
<Calendar.Root type="multiple" maxDays={3}>
  <!-- ...-->
</Calendar.Root>
```

<ComponentPreviewV2 name="calendar-demo-max" componentName="Calendar">

{#snippet preview()}
<CalendarDemoMax />
{/snippet}

</ComponentPreviewV2>

## Appearance & Behavior

### Fixed Weeks

You can use the `fixedWeeks` prop to ensure that the calendar renders a fixed number of weeks, regardless of the number of days in the month. This is useful to keep the calendar visually consistent when the number of days in the month changes.

```svelte
<Calendar.Root fixedWeeks>
  <!-- ...-->
</Calendar.Root>
```

### Multiple Months

You can use the `numberOfMonths` prop to render multiple months at once.

```svelte
<Calendar.Root numberOfMonths={2}>
  <!-- ...-->
</Calendar.Root>
```

### Paged Navigation

By default, when the calendar has more than one month, the previous and next buttons will shift the calendar forward or backward by one month. However, you can change this behavior by setting the `pagedNavigation` prop to `true`, which will shift the calendar forward or backward by the number of months being displayed.

```svelte
<Calendar.Root pagedNavigation>
  <!-- ...-->
</Calendar.Root>
```

### Localization

The calendar will automatically format the content of the calendar according to the `locale` prop, which defaults to `'en-US'`, but can be changed to any locale supported by the [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) API.

```svelte
<Calendar.Root locale="fr-FR">
  <!-- ...-->
</Calendar.Root>
```

### Week Starts On

The calendar will automatically format the content of the calendar according to the `locale`, which will determine what day of the week is the first day of the week.

You can also override this by setting the `weekStartsOn` prop, where `0` is Sunday and `6` is Saturday to force a consistent first day of the week across all locales.

```svelte
<Calendar.Root weekStartsOn={1}>
  <!-- ...-->
</Calendar.Root>
```

### Multiple Selection

You can set the `type` prop to `'multiple'` to allow users to select multiple dates at once.

```svelte
<Calendar.Root type="multiple">
  <!-- ...-->
</Calendar.Root>
```

## Custom Composition

### Month Selector

The `Calendar` component includes a `PrevButton` and `NextButton` component to allow users to navigate between months. This is useful, but sometimes you may want to allow the user to select a specific month from a list of months, rather than having to navigate one at a time.

To achieve this, you can use the `placeholder` prop to set the month of the the calendar view programmatically.

```svelte
<script lang="ts">
  import { Calendar } from "bits-ui";
  import { CalendarDate } from "@internationalized/date";

  let placeholder = $state(new CalendarDate(2024, 8, 3));
</script>

<!-- You can use a select, button, or whatever you wish -->
<button
  onclick={() => {
    placeholder = placeholder.set({ month: 8 });
  }}
>
  Set month to August
</button>

<Calendar.Root bind:placeholder>
  <!-- ... -->
</Calendar.Root>
```

Updating the `placeholder` will update the calendar view to reflect the new month.

## Examples

### Month and Year Selects

This example demonstrates how to use the `placeholder` prop to set the month and year of the calendar view programmatically.

<ComponentPreviewV2 name="calendar-demo-selects" componentName="Calendar Selects">

{#snippet preview()}
<CalendarDemoSelects />
{/snippet}

</ComponentPreviewV2>

### Preset Dates

This example demonstrates how to programatically set the `value` of the calendar to a specific date when a user presses a button.

<ComponentPreviewV2 name="calendar-demo-presets" componentName="Calendar Presets">

{#snippet preview()}
<CalendarDemoPresets />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
