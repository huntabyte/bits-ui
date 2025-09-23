<script lang="ts">
	import { Dialog } from "bits-ui";
	import { DropdownMenu } from "bits-ui";
	import { Popover } from "bits-ui";
</script>

<main>
	<Dialog.Root>
		<Dialog.Trigger data-testid="dialog-trigger">open</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Content data-testid="dialog-content">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger data-testid="dropdown-trigger">open</DropdownMenu.Trigger>
					<DropdownMenu.Portal>
						<DropdownMenu.Content data-testid="dropdown-content">
							<DropdownMenu.Item>item</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
				<Popover.Root>
					<Popover.Trigger data-testid="popover-trigger">open</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content data-testid="popover-content">content</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
				content
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</main>
