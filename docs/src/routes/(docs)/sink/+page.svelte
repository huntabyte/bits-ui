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
				class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 flex items-center justify-center border p-3 text-sm font-medium"
			>
				Tooltip Content
			</div>
		</Tooltip.Content>
	</Tooltip.Root>

	<Dialog.Root bind:open>
		<Dialog.Portal>
			<Dialog.Content
				class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 border p-3 text-sm font-medium"
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
