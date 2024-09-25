---
title: Command
description: A command menu component that can be used to search, filter, and select items.
---

<script>
	import { APISection, ComponentPreviewV2, CommandDemo, CommandDemoDialog } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="command-demo" comp="Command">

{#snippet preview()}
<CommandDemo />
{/snippet}

</ComponentPreviewV2>

## Structure

```svelte
<script lang="ts">
	import { Combobox } from "bits-ui";
</script>

<Command.Root>
	<Combobox.Input />
	<Command.List>
		<Command.Viewport>
			<Command.Empty />
			<Command.Loading />
			<Command.Group>
				<Command.GroupHeading />
				<Command.GroupItems>
					<Command.Item />
					<Command.LinkItem />
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator />
			<Command.Item />
			<Command.LinkItem />
		</Command.Viewport>
	</Command.List>
</Command.Root>
```

## Managing Value State

The `value` prop is used to determine which command item is currently selected. Bits UI provides flexible options for controlling and synchronizing the Command's `value` state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the Command's internal state.

```svelte
<script lang="ts">
	import { Command } from "bits-ui";

	let myValue = $state<string[]>("");
</script>

<button onclick={() => (myValue = "abc")}> Set value to "abc" </button>
<Command.Root bind:value={myValue}>
	<!-- ... -->
</Command.Root>
```

This setup enables setting the Command's value via the custom button and ensures the local `myValue` state updates when the Command updates the value through any internal means (e.g., searching for a command item).

### Change Handler

You can also use the `onValueChange` prop to update local state when the Command's `value` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the state changes.

```svelte
<script lang="ts">
	import { Command } from "bits-ui";

	let myValue = $state<string[]>("");
</script>

<Command.Root
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<!-- ... -->
</Command.Root>
```

### Controlled

Sometimes, you may want complete control over the Command's value state, meaning you will be "kept in the loop" and be required to apply the value state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `Command.Root` component.

```svelte
<script lang="ts">
	import { Command } from "bits-ui";

	let myValue = $state<string>("");
</script>

<Command.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</Command.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled values.

## In a Modal

You can combine the `Command` component with the `Dialog` component to display the command menu within a modal.

<br>

<ComponentPreviewV2 name="command-demo-dialog" comp="Command" size="xs">

{#snippet preview()}
<CommandDemoDialog />
{/snippet}

</ComponentPreviewV2>

## Filtering

### Custom Filter

By default, the `Command` component uses a scoring algorithm to determine how the items should be sorted/filtered. You can provide a custom filter function to override this behavior.

The function should return a number between `0` and `1`, with `1` being a perfect match, and `0` being no match, resulting in the item being hidden entirely.

The following example shows how you might implement a strict substring match filter:

```svelte
<script lang="ts">
	import { Command } from "bits-ui";

	function customFilter(value: string, search: string, keywords?: string[]): number {
		return value.includes(search) ? 1 : 0;
	}
</script>

<Command.Root filter={customFilter}>
	<!-- ... -->
</Command.Root>
```

### Disable Filtering

You can disable filtering by setting the `shouldFilter` prop to `false`.

```svelte
<Command.Root shouldFilter={false}>
	<!-- ... -->
</Command.Root>
```

This is useful when you have a lot of custom logic, need to fetch items asynchronously, or just want to handle filtering yourself. You'll be responsible for iterating over the items and determining which ones should be shown.

## Item Selection

You can use the `onSelect` prop to handle the selection of items.

```svelte
<Command.Item onSelect={() => console.log("selected something!")} />
```

## Links

If you want one of the items to get all the benefits of a link (prefetching, etc.), you should use the `Command.LinkItem` component instead of the `Command.Item` component. The only difference is that the `Command.LinkItem` component will render an `a` element instead of a `div` element.

```svelte
<Command.LinkItem href="/some/path">
	<!-- ... -->
</Command.LinkItem>
```

<APISection {schemas} />
