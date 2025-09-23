<script lang="ts">
	import { ContextMenu } from "bits-ui";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger data-testid="trigger">open</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content data-testid="content">
			<ContextMenu.Root>
				<ContextMenu.Trigger data-testid="nested-trigger">
					{#snippet child({ props })}
						<ContextMenu.Item {...props}>item</ContextMenu.Item>
						<ContextMenu.Portal>
							<ContextMenu.Content data-testid="nested-content">
								<ContextMenu.Item>some nested item</ContextMenu.Item>
							</ContextMenu.Content>
						</ContextMenu.Portal>
					{/snippet}
				</ContextMenu.Trigger>
			</ContextMenu.Root>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
