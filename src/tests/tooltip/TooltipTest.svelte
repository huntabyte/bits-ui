<script lang="ts">
	import { Tooltip } from "$lib";

	type $$Props = Tooltip.Props;

	export let open: $$Props["open"] = false;
</script>

<main data-testid="main">
	<Tooltip.Root bind:open {...$$restProps} openDelay={50} closeDelay={50}>
		<Tooltip.Trigger data-testid="trigger">@sveltejs</Tooltip.Trigger>
		<Tooltip.Content data-testid="content" class="w-80">Content</Tooltip.Content
		>
	</Tooltip.Root>
	<button data-testid="binding" on:click={() => (open = !open)}>{open}</button>
	<div data-testid="outside">outside</div>
</main>
<div data-testid="portal-target" id="portal-target" />
