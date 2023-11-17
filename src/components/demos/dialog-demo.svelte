<script lang="ts">
	import { Dialog } from "$lib";
	import { Separator } from "$lib";
	import { Button } from "$lib";
	import { flyAndScale } from "@/utils";
	import { fade } from "svelte/transition";
	import { X } from "phosphor-svelte";
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button.Root
			builders={[builder]}
			class="rounded-input h-12 text-[15px] font-semibold px-[21px] inline-flex
		items-center justify-center bg-dark text-background hover:button-gradient
		shadow-mini transition-all"
		>
			Subscribe
		</Button.Root>
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			transition={fade}
			transitionConfig={{ duration: 150 }}
			class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
		/>
		<Dialog.Content
			transition={flyAndScale}
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-7 rounded-card-lg md:w-full outline-none shadow-popover"
		>
			<Dialog.Title
				class="font-semibold text-lg tracking-tight flex w-full justify-center items-center"
				>Create API key</Dialog.Title
			>
			<Separator.Root class="-mx-7 block bg-muted h-px my-5" />
			<Dialog.Description class="text-foreground-alt text-sm">
				Create and manage API keys. You can create multiple keys to organize your applications.
			</Dialog.Description>
			<div class="flex w-full items-center justify-center gap-2">
				<Dialog.Close
					class="h-input rounded-input inline-flex items-center justify-center w-full shadow-mini bg-muted font-medium text-[15px]"
					>Cancel</Dialog.Close
				>
			</div>
			<Dialog.Close
				class="absolute right-4 top-[19px] rounded-sm transition-opacity hover:opacity-100 disabled:pointer-events-none"
			>
				<X class="h-4 w-4 text-foreground" />
				<span class="sr-only">Close</span>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
