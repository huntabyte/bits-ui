<script lang="ts">
	import { Command } from "bits-ui";
	import type { ComponentProps } from "svelte";

	let {
		separatorProps,
		...rest
	}: ComponentProps<typeof Command.Root> & {
		separatorProps: ComponentProps<typeof Command.Separator>;
	} = $props();
</script>

<Command.Root {...rest} columns={3} data-testid="root">
	<Command.Input data-testid="input" aria-label="Search" />
	<Command.List data-testid="list">
		<Command.Viewport data-testid="viewport">
			<Command.Empty data-testid="empty">No results found.</Command.Empty>
			<Command.Group data-testid="group-a">
				<Command.GroupHeading data-testid="group-a-heading">
					Suggestions
				</Command.GroupHeading>
				<Command.GroupItems data-testid="group-a-items">
					<Command.Item
						data-testid="item-introduction"
						keywords={["getting started", "tutorial"]}
					>
						Introduction
					</Command.Item>
					<Command.Item
						data-testid="item-delegation"
						keywords={["child", "custom element", "snippets"]}
					>
						Delegation
					</Command.Item>
					<Command.Item
						data-testid="item-styling"
						keywords={["css", "theme", "colors", "fonts", "tailwind"]}
					>
						Styling
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
			<Command.Separator data-testid="separator" {...separatorProps} />
			<Command.Group data-testid="group-b">
				<Command.GroupHeading data-testid="group-b-heading">Components</Command.GroupHeading
				>
				<Command.GroupItems data-testid="group-b-items">
					<Command.Item data-testid="item-calendar" keywords={["dates", "times"]}
						>Calendar</Command.Item
					>
					<Command.Item data-testid="item-radio-group" keywords={["buttons", "forms"]}
						>Radio Group</Command.Item
					>
					<Command.Item
						data-testid="item-combobox"
						keywords={["inputs", "text", "autocomplete"]}
					>
						Combobox
					</Command.Item>
				</Command.GroupItems>
			</Command.Group>
		</Command.Viewport>
	</Command.List>
</Command.Root>
