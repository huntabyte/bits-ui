<script lang="ts">
	import PopoverDemo from "$lib/components/demos/popover-demo.svelte";
	import { Dialog } from "bits-ui";

	let promise = $state<Promise<unknown> | null>(null);
</script>

<Dialog.Root
	onOpenChange={() => {
		promise = new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, 1000);
		});
	}}
>
	<Dialog.Trigger
		class="rounded-input bg-dark text-background
	  shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden
	  inline-flex h-12 items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		New API key
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 bg-black/80"
		/>
		<Dialog.Content
			class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] border p-5 sm:max-w-[490px] md:w-full"
		>
			{#if promise}
				{#await promise}
					<div>loading...</div>
				{:then _data}
					<Dialog.Title
						class="flex w-full items-center justify-center text-lg font-semibold tracking-tight"
					>
						Create API key
					</Dialog.Title>
					<PopoverDemo />
				{/await}
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
