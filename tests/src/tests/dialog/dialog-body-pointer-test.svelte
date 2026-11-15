<script lang="ts">
	import { Dialog, DropdownMenu } from "bits-ui";

	let { overlay = true }: { overlay?: boolean } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
	<Dialog.Portal>
		{#if overlay}
			<Dialog.Overlay
				data-testid="overlay"
				style="position: fixed; inset: 0; background: rgb(0 0 0 / 0.5);"
			/>
		{/if}
		<Dialog.Content
			data-testid="content"
			preventBodyPointerEvents={false}
			style="position: fixed; top: 10px; left: 10px; background: white;"
		>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger data-testid="menu-trigger">menu</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content data-testid="menu-content">
						<DropdownMenu.Item data-testid="menu-item">item</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
