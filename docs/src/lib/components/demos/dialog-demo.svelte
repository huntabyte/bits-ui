<script lang="ts">
	import { Dialog, Label, Separator } from "bits-ui";
	import LockKeyOpen from "phosphor-svelte/lib/LockKeyOpen";
	import X from "phosphor-svelte/lib/X";
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="rounded-input bg-dark text-background
	  shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden
	  inline-flex h-12 items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		New API key
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
		/>
		<Dialog.Content
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border p-5 sm:max-w-[490px] md:w-full"
		>
			<Dialog.Title
				class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
			>
				Create API key
			</Dialog.Title>
			<Separator.Root class="bg-muted -mx-5 mb-6 mt-5 block h-px" />
			<Dialog.Description class="text-foreground-alt text-sm">
				Create and manage API keys. You can create multiple keys to organize your
				applications.
			</Dialog.Description>
			<div class="flex flex-col items-start gap-1 pb-11 pt-7">
				<Label.Root for="apiKey" class="text-sm font-medium">API Key</Label.Root>
				<div class="relative w-full">
					<input
						id="apiKey"
						class="h-input rounded-card-sm border-border-input bg-background placeholder:text-foreground-alt/50 hover:border-dark-40 focus:ring-foreground focus:ring-offset-background focus:outline-hidden inline-flex w-full items-center border px-4 text-base focus:ring-2 focus:ring-offset-2 sm:text-sm"
						placeholder="secret_api_key"
						name="name"
					/>
					<LockKeyOpen class="text-dark/30 absolute right-4 top-[14px] size-[22px]" />
				</div>
			</div>
			<div class="flex w-full justify-end">
				<Dialog.Close
					class="h-input rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex items-center justify-center px-[50px] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
				>
					Save
				</Dialog.Close>
			</div>
			<Dialog.Close
				class="focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden absolute right-5 top-5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
			>
				<div>
					<X class="text-foreground size-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
