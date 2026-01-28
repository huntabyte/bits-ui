<script lang="ts">
	import { Dialog } from "bits-ui";

	let open = $state(false);
</script>

<main>
	<Dialog.Root bind:open>
		<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
		<Dialog.Portal>
			<Dialog.Overlay data-testid="overlay" class="fixed inset-0 h-[100vh] w-[100vw] bg-black">
				overlay
			</Dialog.Overlay>
			<Dialog.Content
				data-testid="content"
				class="tranlate-x-[50%] fixed left-[50%] top-[50%] translate-y-[50%] bg-white p-1"
			>
				<Dialog.Title data-testid="title">title</Dialog.Title>
				<Dialog.Description data-testid="description">description</Dialog.Description>
				<Dialog.Close data-testid="close">close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</main>
