<script lang="ts">
	import { Tooltip, Dialog } from "bits-ui";

	let open = $state(false);
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200} disableCloseOnTriggerClick={true}>
		<Tooltip.Trigger data-testid="trigger" onclick={() => (open = true)}>
			Hover Me & Then Click
		</Tooltip.Trigger>
		<Tooltip.Content data-testid="tooltip-content">
			<div>Tooltip Content</div>
		</Tooltip.Content>
	</Tooltip.Root>

	<Dialog.Root bind:open>
		<Dialog.Portal>
			<Dialog.Content data-testid="dialog-content">
				<p>Dialog Content</p>
				<p>
					Click "Close" to close dialog and hover tooltip again. The tooltip will not
					appear.
				</p>
				<Dialog.Close>Close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</Tooltip.Provider>
