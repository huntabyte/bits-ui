<script lang="ts">
	import { DropdownMenu, Tooltip } from "bits-ui";
</script>

<main>
	<Tooltip.Provider>
		<DropdownMenu.Root>
			<Tooltip.Root delayDuration={0}>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<DropdownMenu.Trigger {...props} data-testid="trigger"
							>Open</DropdownMenu.Trigger
						>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content data-testid="tooltip-content">Actions</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
			<DropdownMenu.Portal>
				<DropdownMenu.Content data-testid="content">
					<DropdownMenu.Item data-testid="item">Item</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</Tooltip.Provider>
	<button data-testid="outside">Outside</button>
</main>
