<script lang="ts">
	import { Toggle, type WithoutChildren } from "$lib/index.js";

	let { pressed = false, ...restProps }: WithoutChildren<Toggle.RootProps> = $props();
</script>

<main>
	<button data-testid="binding" onclick={() => (pressed = !pressed)}>{pressed}</button>
	<Toggle.Root bind:pressed aria-label="toggle" data-testid="root" {...restProps}>a</Toggle.Root>
</main>
