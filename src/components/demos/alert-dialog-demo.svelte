<script lang="ts">
	import { AlertDialog } from "$lib";
	import { Button } from "$lib";
	import { flyAndScale } from "@/utils";
	import { fade } from "svelte/transition";
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger asChild let:builder>
		<Button.Root
			builders={[builder]}
			class="rounded-input h-12 text-[15px] font-semibold px-[21px] inline-flex
		items-center justify-center bg-dark text-background hover:button-gradient
		shadow-mini transition-all"
		>
			Subscribe
		</Button.Root>
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			transition={fade}
			transitionConfig={{ duration: 150 }}
			class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
		/>
		<AlertDialog.Content
			transition={flyAndScale}
			class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-7 rounded-card-lg md:w-full outline-none shadow-popover"
		>
			<div class="flex flex-col gap-4 pb-6">
				<AlertDialog.Title class="font-semibold text-lg tracking-tight"
					>Confirm your transaction</AlertDialog.Title
				>
				<AlertDialog.Description class="text-foreground-alt text-sm">
					This action cannot be undone. This will initiate a monthly wire in the amount of $10,000
					to Huntabyte. Do you wish to continue?
				</AlertDialog.Description>
			</div>
			<div class="flex w-full items-center justify-center gap-2">
				<AlertDialog.Cancel
					class="h-input rounded-input inline-flex items-center justify-center w-full shadow-mini bg-muted font-medium text-[15px]"
					>Cancel</AlertDialog.Cancel
				>
				<AlertDialog.Action
					class="h-input rounded-input bg-dark inline-flex items-center justify-center w-full shadow-mini text-background font-semibold text-[15px]"
					>Continue</AlertDialog.Action
				>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
