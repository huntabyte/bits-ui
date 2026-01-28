<script lang="ts">
	import { Dialog } from "bits-ui";

	let open = $state(false);
</script>

<svelte:head>
	<style>
		html {
			scrollbar-gutter: stable;
		}
	</style>
</svelte:head>

<main>
	<div style="height: 200vh;">
		<Dialog.Root bind:open>
			<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay data-testid="overlay" />
				<Dialog.Content data-testid="content">
					<Dialog.Title>title</Dialog.Title>
					<Dialog.Close data-testid="close">close</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	</div>
</main>
