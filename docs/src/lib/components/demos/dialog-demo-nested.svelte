<script lang="ts">
	import X from "phosphor-svelte/lib/X";
	import { Dialog } from "bits-ui";

	let rootOpen = $state(false);
	let nestedOpen = $state(false);
</script>

<Dialog.Root bind:open={rootOpen}>
	<Dialog.Trigger
		class="inline-flex h-12 items-center
	justify-center rounded-input bg-dark px-[21px] text-[15px]
	font-semibold whitespace-nowrap text-background shadow-mini transition-colors select-none hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
	>
		Open First Dialog
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-black/80 transition-opacity duration-200 data-nested:hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[calc(-50%+var(--bits-dialog-nested-count)*-1.5rem)] scale-[calc(1-var(--bits-dialog-nested-count)*0.05)] rounded-card-lg border bg-background p-6 shadow-popover outline-hidden transition-all duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-[500px] md:w-full"
			style="filter: blur(calc(var(--bits-dialog-nested-count) * 1px));"
		>
			<Dialog.Title class="mb-2 text-lg font-semibold tracking-tight">
				First Dialog
			</Dialog.Title>
			<Dialog.Description class="mb-6 text-sm text-foreground-alt">
				This is the first dialog in the nested dialog stack.
			</Dialog.Description>
			<Dialog.Root bind:open={nestedOpen}>
				<Dialog.Trigger
					class="inline-flex h-12 items-center
				justify-center rounded-input bg-dark px-[21px] text-[15px]
				font-semibold whitespace-nowrap text-background shadow-mini transition-colors select-none hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
				>
					Open Second Dialog
				</Dialog.Trigger>
				<Dialog.Portal>
					<Dialog.Overlay
						class="fixed inset-0 z-50 bg-black/80 transition-opacity duration-200 data-nested:hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
					/>
					<Dialog.Content
						class="fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[calc(-50%+var(--bits-dialog-nested-count)*-1rem)] scale-[calc(1-var(--bits-dialog-nested-count)*0.05)] rounded-card-lg border bg-background p-6 shadow-popover outline-hidden transition-all duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-[500px] md:w-full"
						style="filter: blur(calc(var(--bits-dialog-nested-count) * 1.5px));"
					>
						<Dialog.Title class="mb-2 text-lg font-semibold tracking-tight">
							Second Dialog
						</Dialog.Title>
						<Dialog.Description class="mb-6 text-sm text-foreground-alt">
							This is the second dialog in the nested dialog stack.
						</Dialog.Description>
						<Dialog.Close
							class="inline-flex h-12 items-center
	justify-center rounded-input bg-dark px-[21px] text-[15px]
	font-semibold whitespace-nowrap text-background shadow-mini transition-colors select-none hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
						>
							Close Second Dialog
						</Dialog.Close>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
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
