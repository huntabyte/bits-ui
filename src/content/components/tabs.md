---
title: Tabs
description: Allows users to navigate between different views
---

## Structure

```svelte
<script lang="ts">
	import { Tabs } from "bits-ui";
</script>

<Tabs.Root>
	<Tabs.List>
		<Tabs.Trigger />
	</Tabs.List>
	<Tabs.Content />
</Tabs.Root>
```
