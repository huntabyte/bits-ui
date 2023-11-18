<script lang="ts">
	import { Collapsible } from "$lib";
	type $$Props = Collapsible.Props;
	export let open: Collapsible.Props["open"] = false;
</script>

<main>
	<p data-testid="binding">{open}</p>
	<Collapsible.Root data-testid="root" bind:open {...$$restProps}>
		<Collapsible.Trigger data-testid="trigger">Trigger</Collapsible.Trigger>
		<Collapsible.Content data-testid="content">Content</Collapsible.Content>
	</Collapsible.Root>
	<button data-testid="alt-trigger" on:click={() => (open = !open)}
		>Toggle</button
	>
</main>
