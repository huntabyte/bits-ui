<script lang="ts">
	import { PinInput } from "$lib";

	type $$Props = PinInput.Props;

	export let value: string[] | undefined = undefined;
</script>

<main>
	<button
		data-testid="binding"
		on:click={() => (value = ["0", "1", "1", "3", "4"])}
	>
		{value}
	</button>
	<PinInput.Root bind:value {...$$restProps} data-testid="root">
		{#each Array(5) as _, i}
			<PinInput.Input data-testid="input-{i + 1}" />
		{/each}
		<PinInput.HiddenInput data-testid="hidden-input" />
	</PinInput.Root>
</main>
