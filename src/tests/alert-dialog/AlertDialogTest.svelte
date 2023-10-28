<script lang="ts">
	import { AlertDialog } from "$lib";

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

	type $$Props = AlertDialog.Props;

	export let open: AlertDialog.Props["open"] = false;
</script>

<main>
	<AlertDialog.Root bind:open {...$$restProps}>
		<AlertDialog.Trigger data-testid="trigger">open</AlertDialog.Trigger>
		<AlertDialog.Portal data-testid="portal">
			<AlertDialog.Overlay
				data-testid="overlay"
				class="fixed inset-0 bg-black w-[100vw] h-[100vh]"
			/>
			<AlertDialog.Content
				data-testid="content"
				class="fixed top-[50%] left-[50%] tranlate-x-[50%] translate-y-[50%] bg-white p-1"
			>
				<AlertDialog.Title data-testid="title">title</AlertDialog.Title>
				<AlertDialog.Description data-testid="description">description</AlertDialog.Description>
				<AlertDialog.Cancel data-testid="cancel">cancel</AlertDialog.Cancel>
				<AlertDialog.Action data-testid="action">action</AlertDialog.Action>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
	<p data-testid="binding">{open}</p>
	<button data-testid="toggle" on:click={() => (open = !open)}> toggle </button>

	<div id="portalTarget" data-testid="portalTarget" />
</main>
