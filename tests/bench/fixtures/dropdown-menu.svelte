<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let { count, open = false }: { count: number; open?: boolean } = $props();
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger data-bench="trigger" style="display:block;width:100px;height:40px"
		>open</DropdownMenu.Trigger
	>
	<DropdownMenu.Portal>
		<DropdownMenu.Content data-bench="content" style="max-height: 300px; overflow: auto">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>group</DropdownMenu.GroupHeading>
				{#each { length: count }, i (i)}
					<DropdownMenu.Item data-bench="item">Item {i}</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.CheckboxItem
				>{#snippet children({ checked })}{checked}{/snippet}</DropdownMenu.CheckboxItem
			>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>sub</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item>sub item</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
