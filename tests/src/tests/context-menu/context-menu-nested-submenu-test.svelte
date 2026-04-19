<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger data-testid="trigger">Right click me</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content data-testid="content">
			<ContextMenu.Sub>
				<ContextMenu.SubTrigger data-testid="sub-trigger">Sub</ContextMenu.SubTrigger>
				<ContextMenu.SubContent data-testid="sub-content">
					<ContextMenu.Sub>
						<ContextMenu.SubTrigger data-testid="sub-sub-trigger">
							Sub-sub
						</ContextMenu.SubTrigger>
						<ContextMenu.SubContent data-testid="sub-sub-content">
							<ContextMenu.Item data-testid="sub-sub-item">Hello</ContextMenu.Item>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
