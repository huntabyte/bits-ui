<script lang="ts">
	import { Checkbox } from "$lib";

	type $$Props = Checkbox.Props;

	export let checked: Checkbox.Props["checked"] = false;
</script>

<main>
	<p data-testid="binding">{checked}</p>
	<Checkbox.Root data-testid="root" bind:checked {...$$restProps}>
		<Checkbox.Indicator
			data-testid="indicator"
			let:isChecked
			let:isIndeterminate
		>
			{#if isIndeterminate}
				indeterminate
			{:else if isChecked}
				true
			{:else}
				false
			{/if}
		</Checkbox.Indicator>
		<Checkbox.Input data-testid="input" />
	</Checkbox.Root>
</main>
