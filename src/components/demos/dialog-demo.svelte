<script lang="ts">
	import { Dialog, Separator, Label } from "$lib";
	import { flyAndScale } from "@/utils";
	import { fade } from "svelte/transition";
	import { X, LockKeyOpen } from "phosphor-svelte";
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="inline-flex h-12 items-center
	justify-center whitespace-nowrap rounded-input bg-dark px-[21px]
	text-[15px] font-semibold text-background shadow-mini transition-colors hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
	>
		New API key
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			transition={fade}
			transitionConfig={{ duration: 150 }}
			class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
		/>
		<Dialog.Content
			transition={flyAndScale}
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[94%] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-none sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
				>Create API key</Dialog.Title
			>
			<Separator.Root class="-mx-5 mb-6 mt-5 block h-px bg-muted" />
			<Dialog.Description class="text-sm text-foreground-alt">
				Create and manage API keys. You can create multiple keys to organize
				your applications.
			</Dialog.Description>
			<div class="flex flex-col items-start gap-1 pb-11 pt-7">
				<Label.Root for="apiKey" class="text-sm font-medium">API Key</Label.Root
				>
				<div class="relative w-full">
					<input
						id="apiKey"
						class="inline-flex h-input w-full items-center rounded-card-sm border border-border-input bg-background px-4 text-sm placeholder:text-foreground-alt/50 hover:border-dark-40 focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background"
						placeholder="secret_api_key"
						type="password"
						autocomplete="off"
					/>
					<LockKeyOpen
						class="absolute right-4 top-[14px] text-dark/30 sq-[22px]"
					/>
				</div>
			</div>
			<div class="flex w-full justify-end">
				<Dialog.Close
					class="inline-flex h-input items-center justify-center rounded-input bg-dark px-[50px] text-[15px] font-semibold text-background shadow-mini hover:bg-dark/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
				>
					Save
				</Dialog.Close>
			</div>
			<Dialog.Close
				class="absolute right-5 top-5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
			>
				<div>
					<X class="text-foreground sq-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
