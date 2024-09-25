---
title: Controlled State
description: Learn how to use controlled state in Bits UI components.
---

Sometimes, Bits UI doesn't know what's best for your specific use case. In these cases, you can use controlled state to ensure the component remains in a specific state depending on your needs.

## Uncontrolled State

By default, Bits UI components are uncontrolled. This means that the component is responsible for managing its own state. You can `bind:` to that state for a reference to it, but the component decides when and how to update that state.

For example, the `Accordion.Root` component manages its own `value` state. When you click or press on any of the triggers, the component will update the `value` state to the value of the trigger that was clicked.

You can update the `value` state of the `Accordion.Root` component yourself from the outside, but you can't prevent the component from updating it. Preventing the component from updating the state is where controlled state comes in.

## Controlled State

Controlled state is when you, as the user, are responsible for updating the state of the component. The component will let you know when it thinks it needs to update the state, but you'll be responsible for whether that update happens.

This is useful when you have specific conditions that should be met before the component can update, or anything else your requirements dictate.

To effectively use controlled state, you'll need to set the `controlled<state>` prop to `true` on the component, and you'll also need to pass a local state variable to the component that you'll update yourself. You'll use the `on<state>Change` callback to update the local state variable.

Here's an example of how you might use controlled state with the `Accordion` component:

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";

	let myValue = $state<string>("");
</script>

<Accordion.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</Accordion.Root>
```

In the example above, we're using the `controlledValue` prop to tell the `Accordion.Root` component that it should be in controlled state. If we were to remove the `onValueChange` callback, the component wouldn't respond to user interactions and wouldn't update the `value` state.
