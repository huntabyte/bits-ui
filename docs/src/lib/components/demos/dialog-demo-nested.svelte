<script lang="ts">
	import X from "phosphor-svelte/lib/X";
	import { Dialog } from "bits-ui";
	import { tick } from "svelte";

	let rootOpen = $state(false);
	let nestedOpen = $state(false);
</script>

<Dialog.Root bind:open={rootOpen}>
	<Dialog.Trigger
		class="rounded-input bg-dark text-background
	shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden
	inline-flex h-12 select-none items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		Open First Dialog
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-nested:hidden fixed inset-0 z-50 bg-black/80 transition-opacity duration-200"
		/>
		<Dialog.Content
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[calc(-50%+var(--bits-dialog-nested-count)*-1.5rem)] scale-[calc(1-var(--bits-dialog-nested-count)*0.05)] border p-6 transition-all duration-200 sm:max-w-[500px] md:w-full"
			style="filter: blur(calc(var(--bits-dialog-nested-count) * 1px));"
		>
			<Dialog.Title class="mb-2 text-lg font-semibold tracking-tight">
				First Dialog
			</Dialog.Title>
			<Dialog.Description class="text-foreground-alt mb-6 text-sm">
				This is the first dialog in the nested dialog stack.
			</Dialog.Description>
			<Dialog.Root bind:open={nestedOpen}>
				<Dialog.Trigger
					class="rounded-input bg-dark text-background
				shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden
				inline-flex h-12 select-none items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
				>
					Open Second Dialog
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay
						class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-nested:hidden fixed inset-0 z-50 bg-black/80 transition-opacity duration-200"
					/>
					<Dialog.Content
						class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[calc(-50%+var(--bits-dialog-nested-count)*-1rem)] scale-[calc(1-var(--bits-dialog-nested-count)*0.05)] border p-6 transition-all duration-200 sm:max-w-[500px] md:w-full"
						style="filter: blur(calc(var(--bits-dialog-nested-count) * 1.5px));"
					>
						<Dialog.Title class="mb-2 text-lg font-semibold tracking-tight">
							Second Dialog
						</Dialog.Title>
						<Dialog.Description class="text-foreground-alt mb-6 text-sm">
							This is the second dialog in the nested dialog stack.
						</Dialog.Description>
						<Dialog.Close
							class="rounded-input bg-dark text-background
	shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden
	inline-flex h-12 select-none items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
						>
							Close Second Dialog
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
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
