<script lang="ts">
	import { AlertDialog } from "bits-ui";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger
		class="rounded-input bg-dark text-background
	shadow-mini hover:bg-dark/95 active:scale-98 inline-flex h-12
	select-none items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-all"
	>
		Subscribe
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<AlertDialog.Content
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] gap-4 border p-7 outline-none sm:max-w-lg md:w-full "
		>
			<div class="flex flex-col gap-4 pb-6">
				<AlertDialog.Title class="text-lg font-semibold tracking-tight">
					Confirm your transaction
				</AlertDialog.Title>
				<AlertDialog.Description class="text-foreground-alt text-sm">
					This action cannot be undone. This will initiate a monthly wire in the amount of
					$10,000 to Huntabyte. Do you wish to continue?
				</AlertDialog.Description>
			</div>
			<div class="flex w-full items-center justify-center gap-2">
				<AlertDialog.Cancel
					class="h-input rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background active:scale-98 inline-flex w-full items-center justify-center text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				>
					Cancel
				</AlertDialog.Cancel>
				<AlertDialog.Action
					class="h-input rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-dark focus-visible:ring-offset-background active:scale-98 inline-flex w-full items-center justify-center text-[15px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				>
					Continue
				</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
