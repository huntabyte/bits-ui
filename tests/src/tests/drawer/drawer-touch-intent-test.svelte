<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	let buttonClicks = $state(0);
	let nestedOpen = $state(false);
</script>

<Drawer.Provider>
	<Drawer.Root>
		<Drawer.Trigger data-testid="trigger">open</Drawer.Trigger>
		<Drawer.Portal>
			<Drawer.Backdrop data-testid="backdrop" />
			<Drawer.Viewport data-testid="viewport">
				<Drawer.Popup data-testid="popup">
					<Drawer.Content data-testid="content">
						<button data-testid="generic-button" onclick={() => (buttonClicks += 1)}>
							Action
						</button>
						<input data-testid="text-input" />
						<Drawer.Root bind:open={nestedOpen}>
							<Drawer.Trigger data-testid="nested-trigger">Open nested</Drawer.Trigger
							>
							<Drawer.Portal>
								<Drawer.Backdrop data-testid="nested-backdrop" />
								<Drawer.Viewport data-testid="nested-viewport">
									<Drawer.Popup data-testid="nested-popup">
										<Drawer.Content>Nested content</Drawer.Content>
									</Drawer.Popup>
								</Drawer.Viewport>
							</Drawer.Portal>
						</Drawer.Root>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	</Drawer.Root>
</Drawer.Provider>

<div data-testid="button-clicks">{buttonClicks}</div>
<div data-testid="nested-open">{nestedOpen ? "true" : "false"}</div>
