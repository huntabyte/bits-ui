---
title: Range Calendar
description: Presents a calendar view tailored for selecting date ranges.
---

<script>
	import { APISection, ComponentPreviewV2, RangeCalendarDemo, Callout, RangeCalendarDemoMin, RangeCalendarDemoMax, RangeCalendarDemoMinMax, RangeCalendarDemoExcludeDisabled } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="range-calendar-demo" componentName="Range Calendar">

{#snippet preview()}
<RangeCalendarDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates](/docs/dates) documentation to learn more!

</Callout>

## Structure

```svelte
<script lang="ts">
  import { RangeCalendar } from "bits-ui";
</script>

<RangeCalendar.Root>
  {#snippet children({ months, weekdays })}
    <RangeCalendar.Header>
      <RangeCalendar.PrevButton />
      <RangeCalendar.Heading />
      <RangeCalendar.NextButton />
    </RangeCalendar.Header>
    {#each months as month}
      <RangeCalendar.Grid>
        <RangeCalendar.GridHead>
          <RangeCalendar.GridRow>
            {#each weekdays as day}
              <RangeCalendar.HeadCell>
                {day}
              </RangeCalendar.HeadCell>
            {/each}
          </RangeCalendar.GridRow>
        </RangeCalendar.GridHead>
        <RangeCalendar.GridBody>
          {#each month.weeks as weekDates}
            <RangeCalendar.GridRow>
              {#each weekDates as date}
                <RangeCalendar.Cell {date} month={month.value}>
                  <RangeCalendar.Day />
                </RangeCalendar.Cell>
              {/each}
            </RangeCalendar.GridRow>
          {/each}
        </RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    {/each}
  {/snippet}
</RangeCalendar.Root>
```

## Examples

### Min Days

You can set the `minDays` prop to limit the minimum number of days that must be selected for a range.

```svelte
<RangeCalendar.Root minDays={3}>
  <!-- ... -->
</RangeCalendar.Root>
```

<ComponentPreviewV2 name="range-calendar-demo-min" componentName="Range Calendar">

{#snippet preview()}
<RangeCalendarDemoMin />
{/snippet}

</ComponentPreviewV2>

### Max Days

You can set the `maxDays` prop to limit the maximum number of days that can be selected for a range.

```svelte
<RangeCalendar.Root maxDays={7}>
  <!-- ... -->
</RangeCalendar.Root>
```

<ComponentPreviewV2 name="range-calendar-demo-max" componentName="Range Calendar">

{#snippet preview()}
<RangeCalendarDemoMax />
{/snippet}

</ComponentPreviewV2>

### Min and Max Days

You can set both `minDays` and `maxDays` to limit the number of days that can be selected for a range.

```svelte
<RangeCalendar.Root minDays={3} maxDays={10}>
  <!-- ... -->
</RangeCalendar.Root>
```

<ComponentPreviewV2 name="range-calendar-demo-min-max" componentName="Range Calendar">

{#snippet preview()}
<RangeCalendarDemoMinMax />
{/snippet}

</ComponentPreviewV2>

### Exclude Disabled

You can set the `excludeDisabled` prop to automatically reset the range if any date within the selected range becomes disabled.

```svelte
<RangeCalendar.Root
  excludeDisabled
  isDateDisabled={(date) => isWeekend(date, "en-US")}
>
  <!-- ... -->
</RangeCalendar.Root>
```

<ComponentPreviewV2 name="range-calendar-demo-exclude-disabled" componentName="Range Calendar">

{#snippet preview()}
<RangeCalendarDemoExcludeDisabled />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
