---
title: State Management
description: How to manage the state of Bits UI components
---

State management is a critical aspect of modern UI development. Bits UI components support multiple approaches to manage component state, giving you flexibility based on your specific needs.

Each component's API reference will highlight what props are `bindable`. You can replace the `value` prop used in the examples on this page with any `bindable` prop.

## Two-Way Binding

The simplest approach is using Svelte's built-in two-way binding with `bind:`:

```svelte
<script lang="ts">
  import { ComponentName } from "bits-ui";

  let myValue = $state("default-value");
</script>

<button onclick={() => (myValue = "new-value")}> Update Value </button>

<ComponentName.Root bind:value={myValue}></ComponentName.Root>
```

### Why Use It?

- Zero-boilerplate state updates
- External controls work automatically
- Great for simple use cases

## Function Binding

For complete control, use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) that handles both getting and setting values:

```svelte
<script lang="ts">
  import { ComponentName } from "bits-ui";

  let myValue = $state("default-value");

  function getValue() {
    return myValue;
  }

  function setValue(newValue: string) {
    // Only update during business hours
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 9 && hour <= 17) {
      myValue = newValue;
    }
  }
</script>

<ComponentName.Root bind:value={getValue, setValue}></ComponentName.Root>
```

When the component wants to set the value from an internal action, it will invoke the setter, where you can determine if the setter actually updates the state or not.

### When to Use

- Complex state transformation logic
- Conditional updates
- Debouncing or throttling state changes
- Maintaining additional state alongside the primary value
- Integrating with external state systems
