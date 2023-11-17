<script lang="ts">
	import { Dialog, Separator, Button, Label } from "$lib";
	import { flyAndScale } from "@/utils";
	import { fade } from "svelte/transition";
	import { X, LockKeyOpen } from "phosphor-svelte";
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
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[490px] translate-x-[-50%] translate-y-[-50%] border bg-background p-5 rounded-card-lg md:w-full outline-none shadow-popover"
		>
			<Dialog.Title
				class="font-semibold text-lg tracking-tight flex w-full justify-center items-center"
				>Create API key</Dialog.Title
			>
			<Separator.Root class="-mx-5 block bg-muted h-px mt-5 mb-6" />
			<Dialog.Description class="text-foreground-alt text-sm">
				Create and manage API keys. You can create multiple keys to organize your applications.
			</Dialog.Description>
			<div class="flex flex-col items-start pt-7 gap-1 pb-11">
				<Label.Root for="apiKey" class="text-sm font-medium">API Key</Label.Root>
				<div class="relative w-full">
					<input
						id="apiKey"
						class="h-input rounded-card-sm border border-dark-10 bg-background w-full focus:outline-none focus:ring-2 ring-muted px-4 inline-flex items-center placeholder:text-foreground-alt/50 text-sm"
						placeholder="secret_api_key"
						type="password"
						autocomplete="off"
					/>
					<LockKeyOpen class="absolute right-4 top-4 text-dark/30" />
				</div>
			</div>
			<div class="flex w-full justify-end">
				<Dialog.Close
					class="h-input rounded-input bg-dark inline-flex items-center justify-center shadow-mini text-background font-semibold text-[15px] px-[50px] hover:button-gradient"
				>
					Save
				</Dialog.Close>
			</div>
			<Dialog.Close class="absolute right-5 top-5">
				<div>
					<X class="h-5 w-5 text-foreground" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
