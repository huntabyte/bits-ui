<script lang="ts">
	import { Checkbox } from "$lib";

	export let checked: Checkbox.Props["checked"] = false;
	export let disabled: Checkbox.Props["disabled"] = undefined;
	export let name: Checkbox.Props["name"] = undefined;
	export let required: Checkbox.Props["required"] = undefined;
	export let value: Checkbox.Props["value"] = undefined;
	export let onCheckedChange: Checkbox.Props["onCheckedChange"] = undefined;
	export let asChild = false;
</script>

<main>
	<p data-testid="binding">{checked}</p>
	<Checkbox.Root
		data-testid="root"
		bind:checked
		{name}
		{disabled}
		{required}
		{value}
		{asChild}
		{onCheckedChange}
	>
		<Checkbox.Indicator data-testid="indicator" let:isChecked let:isIndeterminate>
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
