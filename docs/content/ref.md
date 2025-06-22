---
title: Ref
description: Learn about the $bindable ref prop.
---

The `ref` prop provides direct access to the underlying HTML elements in Bits UI components, enabling you to manipulate the DOM when necessary.

## Basic Usage

Every Bits UI component that renders an HTML element exposes a `ref` prop that you can bind to access the rendered element. This is particularly useful for programmatically manipulating the element, such as focusing inputs or measuring dimensions.

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";

  let triggerRef = $state<HTMLButtonElement | null>(null);

  function focusTrigger() {
    triggerRef?.focus();
  }
</script>

<button onclick={focusTrigger}>Focus trigger</button>

<Accordion.Trigger bind:ref={triggerRef}>Trigger content</Accordion.Trigger>
```

## With Child Snippet

Bits UI uses element IDs to track references to underlying elements. This approach ensures that the `ref` prop works correctly even when using the [child snippet](/docs/child-snippet).

### Simple Delegation Example

The `ref` binding will automatically work with delegated child elements/components.

```svelte
<script lang="ts">
  import CustomButton from "./CustomButton.svelte";
  import { Accordion } from "bits-ui";

  let triggerRef = $state<HTMLButtonElement | null>(null);

  function focusTrigger() {
    triggerRef?.focus();
  }
</script>

<Accordion.Trigger bind:ref={triggerRef}>
  {#snippet child({ props })}
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

### Using Custom IDs

When you need to use a custom `id` on the element, pass it to the parent component first so it can be correctly registered with the `ref` binding:

```svelte
<script lang="ts">
  import CustomButton from "./CustomButton.svelte";
  import { Accordion } from "bits-ui";

  let triggerRef = $state<HTMLButtonElement | null>(null);
  const myCustomId = "my-custom-id";
</script>

<Accordion.Trigger bind:ref={triggerRef} id={myCustomId}>
  {#snippet child({ props })}
    <!-- The custom ID will be included in props -->
    <CustomButton {...props} />
  {/snippet}
</Accordion.Trigger>
```

### Common Pitfalls

Avoid setting the `id` directly on the child component/element, as this breaks the connection between the `ref` binding and the element:

```svelte
<!-- ❌ This won't work correctly -->
<Accordion.Trigger bind:ref={triggerRef}>
  {#snippet child({ props })}
    <CustomButton {...props} id="my-custom-id" />
  {/snippet}
</Accordion.Trigger>
```

In this example, the `Accordion.Trigger` component can't track the element because it doesn't know the custom ID.

## Why Possibly `null`?

The `ref` value may be `null` until the component mounts in the DOM. This behavior is consistent with native DOM methods like `getElementById` which can return `null`.

## Creating Your Own `ref` Props

To implement the same ref pattern in your custom components, Bits UI provides a [WithElementRef](/docs/type-helpers/with-element-ref) type helper. This enables you to create type-safe components that follow the same pattern.

```svelte
<script lang="ts">
  import { WithElementRef } from "bits-ui";
  import type { HTMLButtonAttributes } from "svelte/elements";

  // Define props with the ref type
  let {
    ref = $bindable(null),
    children,
    ...rest
  }: WithElementRef<
    HTMLButtonAttributes & {
      yourPropA: string;
      yourPropB: number;
    },
    HTMLButtonElement
  > = $props();
</script>

<button bind:this={ref} {...rest}>
  {@render children?.()}
</button>
```
