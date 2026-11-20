<script lang="ts">
	import {
		Calendar,
		Combobox,
		ContextMenu,
		DateRangePicker,
		NavigationMenu,
		ScrollArea,
	} from "../index.js";
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Docs</NavigationMenu.Trigger>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="/">Home</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>

<ScrollArea.Root>
	<ScrollArea.Viewport>content</ScrollArea.Viewport>
</ScrollArea.Root>

<ContextMenu.Root>
	<ContextMenu.Trigger>right click</ContextMenu.Trigger>
</ContextMenu.Root>

<Combobox.Root type="single">
	<Combobox.Input />
	<Combobox.Trigger>open</Combobox.Trigger>
</Combobox.Root>

<Calendar.Root type="single" />

<DateRangePicker.Root />
