<script lang="ts">
	import { AlertDialog } from "bits-ui";
	import { onDestroy, onMount } from "svelte";

	let {
		title = $bindable("Loading"),
		message = $bindable("Please wait while we load your settings"),
	}: { title: string; message: string } = $props();

	onMount(() => {
		console.log("onMount loader");
	});

	onDestroy(async () => {
		console.log("onDestroy loader");

		// Fix
		// if (document.body.style.pointerEvents === 'none') {
		// 	document.body.style.pointerEvents = '';
		// }
	});
</script>

<AlertDialog.Root open={true}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="fixed inset-0 z-[90]  bg-black/30" />
		<AlertDialog.Content
			class="fixed
      left-[50%] top-[50%] z-[90] w-full max-w-[calc(100%-2rem)]
      translate-x-[-50%] translate-y-[-50%] rounded-xl
      border bg-black p-5
      md:w-[350px]
      "
		>
			<div class="flex h-full flex-col items-center justify-center gap-2 text-white">
				<AlertDialog.Title>
					{title}
				</AlertDialog.Title>

				{#if message}
					<div class="text-center italic text-white">{message}</div>
				{/if}

				<div
					class="border-neutral-e4 border-t-primary mb-2 mt-6
					h-10 w-10 rounded-full border-[5px] [animation:spin_0.5s_linear_infinite]"
				></div>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
