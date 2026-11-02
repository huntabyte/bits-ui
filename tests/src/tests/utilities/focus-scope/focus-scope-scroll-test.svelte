<script lang="ts">
	import { Dialog } from "bits-ui";
</script>

<main>
	<button data-testid="outside">outside</button>
	<Dialog.Root>
		<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
		<Dialog.Portal>
			<!-- far below the fold so focusing anything inside would scroll the page -->
			<Dialog.Content
				data-testid="content"
				preventScroll={false}
				style="position: absolute; top: 3000px; left: 0;"
			>
				<Dialog.Close data-testid="close">close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	<div style="height: 6000px;"></div>
</main>
