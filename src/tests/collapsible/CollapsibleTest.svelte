<script lang="ts">
	import { Collapsible } from "$lib";

	export let open: Collapsible.Props["open"] = false;
	export let onOpenChange: Collapsible.Props["onOpenChange"] = undefined;
	export let disabled: Collapsible.Props["disabled"] = undefined;
	export let asChild = false;
</script>

<main>
	<p data-testid="binding">{open}</p>
	<Collapsible.Root data-testid="root" bind:open {disabled} {asChild} {onOpenChange}>
		<Collapsible.Trigger data-testid="trigger">Trigger</Collapsible.Trigger>
		<Collapsible.Content data-testid="content">Content</Collapsible.Content>
	</Collapsible.Root>
	<button data-testid="alt-trigger" on:click={() => (open = !open)}>Toggle</button>
</main>
