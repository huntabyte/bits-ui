<script lang="ts">
	import { Tooltip, ContextMenu } from "bits-ui";
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={0}>
		<Tooltip.Trigger data-testid="tooltip-trigger">
			<ContextMenu.Root>
				<ContextMenu.Trigger data-testid="context-menu-trigger"
					>Right click me</ContextMenu.Trigger
				>
				<ContextMenu.Portal>
					<ContextMenu.Content data-testid="context-menu-content">
						<ContextMenu.Item>Item1</ContextMenu.Item>
						<ContextMenu.Item>Item2</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Portal>
			</ContextMenu.Root>
		</Tooltip.Trigger>
		<Tooltip.Content data-testid="tooltip-content">Tooltip content</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
