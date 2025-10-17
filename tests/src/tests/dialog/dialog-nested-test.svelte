<script lang="ts">
	import { Dialog } from "bits-ui";
</script>

<main>
	<Dialog.Root>
		<Dialog.Trigger data-testid="first-open">first open</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay data-testid="first-overlay" />
			<Dialog.Content data-testid="first-content">
				<Dialog.Close data-testid="first-close">first close</Dialog.Close>
				<Dialog.Root>
					<Dialog.Trigger data-testid="second-open">second open</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay data-testid="second-overlay" />
						<Dialog.Content data-testid="second-content">
							<Dialog.Close data-testid="second-close">second close</Dialog.Close>
							<Dialog.Root>
								<Dialog.Trigger data-testid="third-open">third open</Dialog.Trigger>
								<Dialog.Portal>
									<Dialog.Overlay data-testid="third-overlay" />
									<Dialog.Content data-testid="third-content">
										<Dialog.Close data-testid="third-close"
											>third close</Dialog.Close
										>
									</Dialog.Content>
								</Dialog.Portal>
							</Dialog.Root>
						</Dialog.Content>
					</Dialog.Portal>
				</Dialog.Root>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	<div id="portalTarget" data-testid="portalTarget"></div>
</main>
