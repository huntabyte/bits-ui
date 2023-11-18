<script lang="ts">
	import { Toggle } from "$lib";

	type $$Props = Toggle.Props;
	export let pressed: $$Props["pressed"] = false;
</script>

<main>
	<button data-testid="binding" on:click={() => (pressed = !pressed)}
		>{pressed}</button
	>
	<Toggle.Root
		bind:pressed
		aria-label="toggle"
		data-testid="root"
		{...$$restProps}>a</Toggle.Root
	>
</main>
