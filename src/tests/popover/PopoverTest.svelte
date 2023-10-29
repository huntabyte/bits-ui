<script lang="ts">
	import { Popover } from "$lib";

	type $$Props = Popover.Props;

	export let open: $$Props["open"] = false;
</script>

<main data-testid="main">
	<Popover.Root bind:open {...$$restProps}>
		<Popover.Arrow data-testid="arrow" />
		<Popover.Trigger data-testid="trigger">trigger</Popover.Trigger>
		<Popover.Content data-testid="content">
			content
			<Popover.Close data-testid="close">close</Popover.Close>
		</Popover.Content>
	</Popover.Root>

	<button data-testid="binding" on:click={() => (open = !open)}>{open}</button>
	<div data-testid="outside">outside</div>
</main>
<div data-testid="portal-target" id="portal-target" />
