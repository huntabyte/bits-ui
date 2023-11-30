<script lang="ts">
	import { Checkbox } from "$lib";
	import { Label } from "$lib";
	import { Check, Minus } from "phosphor-svelte";
</script>

<div class="flex items-center space-x-3">
	<Checkbox.Root
		id="terms"
		aria-labelledby="terms-label"
		class="peer inline-flex items-center justify-center rounded-md border border-muted bg-foreground sq-[25px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98 data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background"
		checked="indeterminate"
	>
		<Checkbox.Indicator
			let:isChecked
			let:isIndeterminate
			class="inline-flex items-center justify-center text-background"
		>
			{#if isChecked}
				<Check class="sq-[15px]" weight="bold" />
			{:else if isIndeterminate}
				<Minus class="sq-[15px]" weight="bold" />
			{/if}
		</Checkbox.Indicator>
	</Checkbox.Root>
	<Label.Root
		id="terms-label"
		for="terms"
		class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		Accept terms and conditions
	</Label.Root>
</div>
