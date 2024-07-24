---
title: WithoutChildrenOrChild
description: A type helper to exclude the child ad children snippet props from a component.
---

The `WithoutChildrenOrChild` type helper is used to exclude the `child` and `children` snippet props from a component. This is useful when you're building custom component wrappers that populate the `children` prop of a component and don't provide a way to pass a custom `children` or `child` snippet.

To learn more about the `child` snippet prop, check out the [delegation](/docs/delegation) documentation.

```svelte title="CustomAccordion.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";

	type Props = WithoutChildrenOrChild<{
		value: string;
		onValueChange: (value: string) => void;
	}>;

	let { value, onValueChange, ...restProps }: Props = $props();
</script>

<Accordion.Root {...restProps}>
	<Accordion.Item {value} {onValueChange}>
		<Accordion.Header />
		<Accordion.Trigger />
		<Accordion.Content />
	</Accordion.Item>
</Accordion.Root>
```

Now, the `CustomAccordion` component won't expose `children` or `child` snippet props to the user, but will expose the other root component props.
