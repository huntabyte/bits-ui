<script lang="ts">
	import { Switch, type WithoutChildren } from "$lib/index.js";

	let { checked = false, ...restProps }: WithoutChildren<Switch.RootProps> = $props();
</script>

<main>
	<button data-testid="binding" onclick={() => (checked = !checked)}>{checked}</button>
	<Switch.Root aria-label="airplane mode" data-testid="root" bind:checked {...restProps}>
		<Switch.Thumb data-testid="thumb" />
	</Switch.Root>
</main>
