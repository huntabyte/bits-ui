<script lang="ts">
	import { Dialog, Label, Separator } from "bits-ui";
	import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";
	import X from "phosphor-svelte/lib/X";
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="inline-flex h-12 items-center
	  justify-center rounded-input bg-dark px-[21px] text-[15px]
	  font-semibold whitespace-nowrap text-background shadow-mini transition-colors hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
	>
		New API key
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-card-lg border bg-background p-5 shadow-popover outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				Create API key
			</Dialog.Title>
			<Separator.Root class="-mx-5 mt-5 mb-6 block h-px bg-muted" />
			<Dialog.Description class="text-sm text-foreground-alt">
				Create and manage API keys. You can create multiple keys to organize your
				applications.
			</Dialog.Description>
			<div class="flex flex-col items-start gap-1 pt-7 pb-11">
				<Label.Root for="apiKey" class="text-sm font-medium">API Key</Label.Root>
				<div class="relative w-full">
					<input
						id="apiKey"
						class="inline-flex h-input w-full items-center rounded-card-sm border border-border-input bg-background px-4 text-base placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background focus:outline-hidden sm:text-sm"
						placeholder="secret_api_key"
						name="name"
					/>
					<LockKeyOpen class="absolute top-[14px] right-4 size-[22px] text-dark/30" />
				</div>
			</div>
			<div class="flex w-full justify-end">
				<Dialog.Close
					class="inline-flex h-input items-center justify-center rounded-input bg-dark px-[50px] text-[15px] font-semibold text-background shadow-mini hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
				>
					Save
				</Dialog.Close>
			</div>
			<Dialog.Close
				class="absolute top-5 right-5 rounded-md focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
			>
				<div>
					<X class="size-5 text-foreground" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
