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
			class="inline-flex h-12 items-center
		justify-center whitespace-nowrap rounded-input bg-dark px-[21px]
		text-[15px] font-semibold text-background shadow-mini ring-dark ring-offset-background transition-colors hover:bg-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
			class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-card-lg border bg-background p-7 shadow-popover outline-none md:w-full"
		>
			<div class="flex flex-col gap-4 pb-6">
				<AlertDialog.Title class="text-lg font-semibold tracking-tight"
					>Confirm your transaction</AlertDialog.Title
				>
				<AlertDialog.Description class="text-sm text-foreground-alt">
					This action cannot be undone. This will initiate a monthly wire in the
					amount of $10,000 to Huntabyte. Do you wish to continue?
				</AlertDialog.Description>
			</div>
			<div class="flex w-full items-center justify-center gap-2">
				<AlertDialog.Cancel
					class="inline-flex h-input w-full items-center justify-center rounded-input bg-muted text-[15px] font-medium shadow-mini"
					>Cancel</AlertDialog.Cancel
				>
				<AlertDialog.Action
					class="inline-flex h-input w-full items-center justify-center rounded-input bg-dark text-[15px] font-semibold text-background shadow-mini"
					>Continue</AlertDialog.Action
				>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
