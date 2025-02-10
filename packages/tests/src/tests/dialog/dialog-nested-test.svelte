<script lang="ts">
	import { Dialog } from "bits-ui";
</script>

<main>
	<Dialog.Root>
		<Dialog.Trigger data-testid="first-open">first open</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Content>
				<Dialog.Close data-testid="first-close">first close</Dialog.Close>
				<Dialog.Root>
					<Dialog.Trigger data-testid="second-open">second open</Dialog.Trigger>
					<Dialog.Portal>
						<Dialog.Overlay>
							<Dialog.Content>
								<Dialog.Close data-testid="second-close">second close</Dialog.Close>
							</Dialog.Content>
						</Dialog.Overlay>
					</Dialog.Portal>
				</Dialog.Root>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	<div id="portalTarget" data-testid="portalTarget"></div>
</main>
