<script lang="ts">
	import { Checkbox } from "$lib/index.js";

	let { checked = false, ...restProps }: Checkbox.RootProps = $props();
</script>

<main>
	<p data-testid="binding">{checked}</p>
	<Checkbox.Root name="terms" data-testid="root" bind:checked {...restProps}>
		{#snippet children({ checked })}
			<span data-testid="indicator">
				{checked}
			</span>
		{/snippet}
	</Checkbox.Root>
</main>
