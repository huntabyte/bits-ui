<script lang="ts">
	import { RadioGroup } from "bits-ui";

	let { value = "" }: { value?: string } = $props();
	let form: HTMLFormElement;
</script>

<form bind:this={form} data-testid="form">
	<RadioGroup.Root name="option" bind:value>
		{#each ["a", "b", "c"] as item (item)}
			<RadioGroup.Item value={item} data-testid="{item}-item">{item}</RadioGroup.Item>
		{/each}
	</RadioGroup.Root>
	<button type="button" data-testid="reset" onclick={() => form.reset()}>reset</button>
	<button
		type="button"
		data-testid="reset-and-set"
		onclick={() => {
			form.reset();
			value = "b";
		}}
	>
		reset and set
	</button>
	<span data-testid="value">{value}</span>
</form>
