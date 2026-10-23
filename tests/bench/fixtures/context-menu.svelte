<script lang="ts">
	import { ContextMenu } from "bits-ui";
	let { count, open = false }: { count: number; open?: boolean } = $props();
</script>

<ContextMenu.Root bind:open>
	<ContextMenu.Trigger data-bench="trigger" style="display:block;width:100px;height:40px">open</ContextMenu.Trigger>
	<ContextMenu.Portal>
		<ContextMenu.Content data-bench="content" style="max-height: 300px; overflow: auto">
			<ContextMenu.Group>
				<ContextMenu.GroupHeading>group</ContextMenu.GroupHeading>
				{#each { length: count }, i (i)}
					<ContextMenu.Item data-bench="item">Item {i}</ContextMenu.Item>
				{/each}
			</ContextMenu.Group>
			<ContextMenu.Separator />
			<ContextMenu.CheckboxItem>{#snippet children({ checked })}{checked}{/snippet}</ContextMenu.CheckboxItem>
			<ContextMenu.Sub>
				<ContextMenu.SubTrigger>sub</ContextMenu.SubTrigger>
				<ContextMenu.SubContent>
					<ContextMenu.Item>sub item</ContextMenu.Item>
				</ContextMenu.SubContent>
			</ContextMenu.Sub>
		</ContextMenu.Content>
	</ContextMenu.Portal>
</ContextMenu.Root>
