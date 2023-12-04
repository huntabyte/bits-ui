<script lang="ts">
	import { Progress } from "$lib";

	type $$Props = Progress.Props;
	export let value = 0;
</script>

<main>
	<Progress.Root
		aria-label="progress"
		data-testid="root"
		bind:value
		{...$$restProps}
	/>
	<button data-testid="binding" on:click={() => (value = 50)}>{value}</button>
</main>
