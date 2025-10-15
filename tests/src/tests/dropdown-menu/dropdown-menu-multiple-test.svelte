<script lang="ts">
	import { DropdownMenu } from "bits-ui";

	let open1 = $state(false);
	let open2 = $state(false);
	let open3 = $state(false);
</script>

<div
	data-testid="container"
	style="display: flex; flex-direction: column; gap: 1000px; padding: 100px;"
>
	<button data-testid="top-button">Top Button (for focus testing)</button>

	<div data-testid="dropdown-1-container">
		<DropdownMenu.Root bind:open={open1}>
			<DropdownMenu.Trigger data-testid="trigger-1">Open Dropdown 1</DropdownMenu.Trigger>
			<DropdownMenu.Content data-testid="content-1">
				<DropdownMenu.Item data-testid="item-1">Item 1</DropdownMenu.Item>
				<DropdownMenu.Item data-testid="item-1-2">Item 2</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<div data-testid="binding-1">{open1}</div>
	</div>

	<div data-testid="dropdown-2-container">
		<DropdownMenu.Root bind:open={open2}>
			<DropdownMenu.Trigger data-testid="trigger-2">Open Dropdown 2</DropdownMenu.Trigger>
			<DropdownMenu.Content data-testid="content-2">
				<DropdownMenu.Item data-testid="item-2">Item 1</DropdownMenu.Item>
				<DropdownMenu.Item data-testid="item-2-2">Item 2</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<div data-testid="binding-2">{open2}</div>
	</div>

	<div data-testid="dropdown-3-container">
		<DropdownMenu.Root bind:open={open3}>
			<DropdownMenu.Trigger data-testid="trigger-3">Open Dropdown 3</DropdownMenu.Trigger>
			<DropdownMenu.Content data-testid="content-3">
				<DropdownMenu.Item data-testid="item-3">Item 1</DropdownMenu.Item>
				<DropdownMenu.Item data-testid="item-3-2">Item 2</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
		<div data-testid="binding-3">{open3}</div>
	</div>

	<button data-testid="bottom-button">Bottom Button (for focus testing)</button>
</div>
