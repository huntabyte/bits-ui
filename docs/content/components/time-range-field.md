---
title: Time Range Field
description: Allows users to input a range of times within a designated field.
---

<script>
	import { APISection, ComponentPreviewV2, DateRangeFieldDemo, TimeRangeFieldDemo, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="time-range-field-demo" componentName="Time Range Field">

{#snippet preview()}
<TimeRangeFieldDemo />
{/snippet}

</ComponentPreviewV2>

<Callout type="tip" title="Heads up!">

Before diving into this component, it's important to understand how dates/times work in Bits UI. Please read the [Dates/Times](/docs/dates) documentation to learn more!

</Callout>

## Overview

The `TimeRangeField` component combines two [Time Field](/docs/components/time-field) components to create a time range field. Check out the [Time Field](/docs/components/time-field) component documentation for information on how to customize this component.

## Structure

```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
</script>

<TimeRangeField.Root>
  <TimeRangeField.Label>Working Hours</TimeRangeField.Label>
  {#each ["start", "end"] as const as type}
    <TimeRangeField.Input {type}>
      {#snippet children({ segments })}
        {#each segments as { part, value }}
          <TimeRangeField.Segment {part}>
            {value}
          </TimeRangeField.Segment>
        {/each}
      {/snippet}
    </TimeRangeField.Input>
  {/each}
</TimeRangeField.Root>
```

## Managing Placeholder State

This section covers how to manage the `placeholder` state of the component.

### Two-Way Binding

Use `bind:placeholder` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { TimeRangeField } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myPlaceholder = $state(new Time(12, 30));
</script>

<TimeRangeField.Root bind:placeholder={myPlaceholder}>
  <!-- ... -->
</TimeRangeField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { TimeRangeField, type TimeValue } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myPlaceholder = $state(new Time(12, 30));

  function getPlaceholder() {
    return myPlaceholder;
  }

  function setPlaceholder(newPlaceholder: TimeValue) {
    myPlaceholder = newPlaceholder;
  }
</script>

<TimeRangeField.Root bind:placeholder={getPlaceholder, setPlaceholder}>
  <!-- ... -->
</TimeRangeField.Root>
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte {3,6,8}
<script lang="ts">
  import { TimeRangeField, type TimeRange } from "bits-ui";
  import { Time } from "@internationalized/date";
  let myValue = $state<TimeRange>({
    start: new Time(12, 30),
    end: new Time(12, 30),
  });
</script>

<button
  onclick={() => {
    myValue = {
      start: myValue.start.add({ hours: 1 }),
      end: myValue.end.add({ hours: 1 }),
    };
  }}
>
  Add 1 hour
</button>
<TimeRangeField.Root bind:value={myValue}>
  <!-- ... -->
</TimeRangeField.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { TimeRangeField, type TimeRange } from "bits-ui";

  let myValue = $state<TimeRange | undefined>({
    start: undefined,
    end: undefined,
  });

  function getValue() {
    return myValue;
  }

  function setValue(newValue: TimeRange | undefined) {
    myValue = newValue;
  }
</script>

<DateRangeField.Root bind:value={getValue, setValue}>
  <!-- ... -->
</DateRangeField.Root>
```

<APISection {schemas} />
