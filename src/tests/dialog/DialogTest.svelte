<script lang="ts">
	import { Dialog } from "$lib";

	/**
	 *
    preventScroll?: boolean | undefined;
    closeOnEscape?: boolean | undefined;
    closeOnOutsideClick?: boolean | undefined;
    portal?: string | HTMLElement | null | undefined;
    openFocus?: FocusProp | undefined;
    closeFocus?: FocusProp | undefined;
    open?: boolean | undefined;
    onOpenChange?: OnChangeFn<...> | undefined;
	 */

	type $$Props = Dialog.Props;

	export let open: Dialog.Props["open"] = false;
</script>

<main>
	<Dialog.Root bind:open {...$$restProps}>
		<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
		<Dialog.Portal data-testid="portal">
			<Dialog.Overlay data-testid="overlay" class="fixed inset-0 bg-black w-[100vw] h-[100vh]" />
			<Dialog.Content
				data-testid="content"
				class="fixed top-[50%] left-[50%] tranlate-x-[50%] translate-y-[50%] bg-white p-1"
			>
				<Dialog.Title data-testid="title">title</Dialog.Title>
				<Dialog.Description data-testid="description">description</Dialog.Description>
				<Dialog.Close data-testid="close">close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
	<p data-testid="binding">{open}</p>
</main>
