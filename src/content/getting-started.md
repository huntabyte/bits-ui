---
title: Getting Started
description: Learn how to get started using Bits in your app.
---

## Installation

Install bits using your favorite package manager.

```bash
npm install @huntabyte/bits
```

You can them import and start using them in your app.

```svelte
<script lang="ts">
	import { Accordion } from "@huntabyte/bits";
</script>

<Accordion.Root>
	<Accordion.Item value="first">
		<Accordion.Header>
			<Accordion.Trigger>First</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>This is the first accordion content</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="second">
		<Accordion.Header>
			<Accordion.Trigger>Second</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>This is the second accordion content</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="third">
		<Accordion.Header>
			<Accordion.Trigger>Third</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>This is the third accordion content</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
```
