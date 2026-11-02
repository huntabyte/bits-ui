<script lang="ts">
	import { Dialog } from "bits-ui";

	let { portalTo }: { portalTo: HTMLElement } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
	<Dialog.Portal to={portalTo}>
		<Dialog.Content data-testid="content">
			<Dialog.Title>title</Dialog.Title>
			<!-- explicit tabindex: WebKit on macOS skips buttons on Tab by default -->
			<button data-testid="first" tabindex="0">first</button>
			<button data-testid="second" tabindex="0">second</button>
			<Dialog.Close data-testid="close">close</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
