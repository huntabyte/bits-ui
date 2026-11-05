<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	let { portalTo }: { portalTo: HTMLElement } = $props();
</script>

<DropdownMenu.Root open>
	<DropdownMenu.Trigger>Menu</DropdownMenu.Trigger>
	<DropdownMenu.Portal to={portalTo}>
		<DropdownMenu.Content
			data-testid="shadow-menu-content"
			onOpenAutoFocus={(e) => e.preventDefault()}
		>
			<DropdownMenu.Sub open>
				<DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
				<DropdownMenu.Portal to={portalTo}>
					<DropdownMenu.SubContent data-testid="shadow-menu-subcontent">
						<DropdownMenu.Item disabled data-testid="shadow-menu-disabled"
							>Unavailable</DropdownMenu.Item
						>
					</DropdownMenu.SubContent>
				</DropdownMenu.Portal>
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
