<script lang="ts">
	import { Dialog } from "$lib";

	type $$Props = Dialog.Props;

	export let open: Dialog.Props["open"] = false;
</script>

<main>
	<Dialog.Root bind:open {...$$restProps}>
		<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
		<Dialog.Portal data-testid="portal">
			<Dialog.Overlay
				data-testid="overlay"
				class="fixed inset-0 h-[100vh] w-[100vw] bg-black"
			/>
			<Dialog.Content
				data-testid="content"
				class="tranlate-x-[50%] fixed left-[50%] top-[50%] translate-y-[50%] bg-white p-1"
			>
				<Dialog.Title data-testid="title">title</Dialog.Title>
				<Dialog.Description data-testid="description"
					>description</Dialog.Description
				>
				<Dialog.Close data-testid="close">close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	<p data-testid="binding">{open}</p>
	<button data-testid="toggle" on:click={() => (open = !open)}>toggle</button>
	<div id="portalTarget" data-testid="portalTarget" />
</main>
