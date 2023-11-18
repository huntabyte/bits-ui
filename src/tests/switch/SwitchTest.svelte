<script lang="ts">
	import { Switch } from "$lib";

	type $$Props = Switch.Props;

	export let checked: Switch.Props["checked"] = false;

	const inputAttrs = {
		"data-testid": "input"
	};
</script>

<main>
	<button data-testid="binding" on:click={() => (checked = !checked)}
		>{checked}</button
	>
	<Switch.Root
		aria-label="airplane mode"
		data-testid="root"
		bind:checked
		{...$$restProps}
		{inputAttrs}
	>
		<Switch.Thumb data-testid="thumb" />
	</Switch.Root>
</main>
