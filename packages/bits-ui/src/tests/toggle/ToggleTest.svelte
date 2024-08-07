<script lang="ts">
	import { Toggle, type WithoutChildrenOrChild } from "$lib/index.js";

	let { pressed = false, ...restProps }: WithoutChildrenOrChild<Toggle.RootProps> = $props();
</script>

<main>
	<button data-testid="binding" onclick={() => (pressed = !pressed)}>{pressed}</button>
	<Toggle.Root bind:pressed aria-label="toggle" data-testid="root" {...restProps}>a</Toggle.Root>
</main>
