---
title: Radio Group
description: Allows users to select a single option from a list of mutually exclusive choices.
---

<script>
	import { APISection, ComponentPreviewV2, RadioGroupDemo, RadioGroupDemoReadonly, RadioGroupDemoDisabled, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="radio-group-demo" componentName="Radio Group">

{#snippet preview()}
<RadioGroupDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
  import { RadioGroup } from "bits-ui";
</script>

<RadioGroup.Root>
  <RadioGroup.Item>
    {#snippet children({ checked })}
      {#if checked}
        ✅
      {/if}
    {/snippet}
  </RadioGroup.Item>
</RadioGroup.Root>
```

## Reusable Components

It's recommended to use the `RadioGroup` primitives to create your own custom components that can be used throughout your application.

In the example below, we're creating a custom `MyRadioGroup` component that takes in an array of items and renders a radio group with those items along with a [`Label`](/docs/components/label) component for each item.

```svelte title="MyRadioGroup.svelte"
<script lang="ts">
  import {
    RadioGroup,
    Label,
    type WithoutChildrenOrChild,
    useId,
  } from "bits-ui";

  type Item = {
    value: string;
    label: string;
    disabled?: boolean;
  };

  type Props = WithoutChildrenOrChild<RadioGroup.RootProps> & {
    items: Item[];
  };

  let {
    value = $bindable(""),
    ref = $bindable(null),
    items,
    ...restProps
  }: Props = $props();
</script>

<RadioGroup.Root bind:value bind:ref {...restProps}>
  {#each items as item}
    {@const id = useId()}
    <div>
      <RadioGroup.Item {id} value={item.value} disabled={item.disabled}>
        {#snippet children({ checked })}
          {#if checked}
            ✅
          {/if}
        {/snippet}
      </RadioGroup.Item>
      <Label.Root for={id}>{item.label}</Label.Root>
    </div>
  {/each}
</RadioGroup.Root>
```

You can then use the `MyRadioGroup` component in your application like so:

```svelte title="+page.svelte"
<script lang="ts">
  import MyRadioGroup from "$lib/components/MyRadioGroup.svelte";

  const myItems = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "coconut", label: "Coconut", disabled: true },
  ];
</script>

<MyRadioGroup items={myItems} name="favoriteFruit" />
```

## Managing Value State

This section covers how to manage the `value` state of the component.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
  import { RadioGroup } from "bits-ui";
  let myValue = $state("");
</script>

<button onclick={() => (myValue = "A")}> Select A </button>

<RadioGroup.Root bind:value={myValue}>
  <!-- ... -->
</RadioGroup.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
  import { RadioGroup } from "bits-ui";
  let myValue = $state("");

  function getValue() {
    return myValue;
  }

  function setValue(newValue: string) {
    myValue = newValue;
  }
</script>

<RadioGroup.Root bind:value={getValue, setValue}>
  <!-- ... -->
</RadioGroup.Root>
```

## HTML Forms

If you set the `name` prop on the `RadioGroup.Root` component, a hidden input element will be rendered to submit the value of the radio group to a form.

```svelte /name="favoriteFruit"/
<RadioGroup.Root name="favoriteFruit">
  <!-- ... -->
</RadioGroup.Root>
```

### Required

To make the hidden input element `required` you can set the `required` prop on the `RadioGroup.Root` component.

```svelte /required/
<RadioGroup.Root required>
  <!-- ... -->
</RadioGroup.Root>
```

## Disabling Items

You can disable a radio group item by setting the `disabled` prop to `true`.

```svelte /disabled/
<RadioGroup.Item value="apple" disabled>Apple</RadioGroup.Item>
```

## Orientation

The `orientation` prop is used to determine the orientation of the radio group, which influences how keyboard navigation will work.

When the `orientation` is set to `'vertical'`, the radio group will navigate through the items using the `ArrowUp` and `ArrowDown` keys. When the `orientation` is set to `'horizontal'`, the radio group will navigate through the items using the `ArrowLeft` and `ArrowRight` keys.

```svelte /orientation="vertical"/ /orientation="horizontal"/
<RadioGroup.Root orientation="vertical">
  <!-- ... -->
</RadioGroup.Root>

<RadioGroup.Root orientation="horizontal">
  <!-- ... -->
</RadioGroup.Root>
```

## Examples

### Readonly

When a radio group is readonly, users can focus and navigate through the items but cannot change the selection. This is useful for displaying information that should be visible but not editable.

<ComponentPreviewV2 name="radio-group-demo-readonly" componentName="Radio Group Readonly">

{#snippet preview()}
<RadioGroupDemoReadonly />
{/snippet}

</ComponentPreviewV2>

```svelte /readonly/
<RadioGroup.Root readonly>
  <!-- ... -->
</RadioGroup.Root>
```

### Disabled

When a radio group is disabled, users cannot interact with it at all. The entire group becomes non-focusable and non-interactive.

<ComponentPreviewV2 name="radio-group-demo-disabled" componentName="Radio Group Disabled">

{#snippet preview()}
<RadioGroupDemoDisabled />
{/snippet}

</ComponentPreviewV2>

```svelte /disabled/
<RadioGroup.Root disabled>
  <!-- ... -->
</RadioGroup.Root>
```

<APISection {schemas} />
