<script lang="ts">
	import { Tooltip, Dialog } from "bits-ui";

	let open = $state(false);
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200} disableCloseOnTriggerClick={true}>
		<Tooltip.Trigger
			class="inline-flex size-fit items-center justify-center"
			onclick={() => (open = true)}
		>
			Hover Me & Then Click
		</Tooltip.Trigger>
		<Tooltip.Content sideOffset={8} side="bottom">
			<div
				class="z-0 flex items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-hidden"
			>
				Tooltip Content
			</div>
		</Tooltip.Content>
	</Tooltip.Root>

	<Dialog.Root bind:open>
		<Dialog.Portal>
			<Dialog.Content
				class="z-0 rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-hidden"
			>
				<p>Dialog Content</p>
				<p>
					Click "Close" to close dialog and hover tooltip again. The tooltip will not
					appear.
				</p>
				<Dialog.Close class="block">Close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</Tooltip.Provider>
