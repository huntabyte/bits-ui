<script lang="ts">
	import { Checkbox } from "$lib";
	import { Label } from "$lib";
	import { Check, Minus } from "phosphor-svelte";
</script>

<div class="flex items-center space-x-2">
	<Checkbox.Root
		id="terms"
		aria-labelledby="terms-label"
		class="peer h-[25px] w-[25px] rounded-md border border-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-muted focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:bg-foreground data-[state=checked]:focus-visible:ring-foreground"
	>
		<Checkbox.Indicator
			let:isChecked
			let:isIndeterminate
			class="inline-flex items-center justify-center"
		>
			{#if isChecked}
				<Check class="h-[15px] w-[15px] text-background" />
			{:else if isIndeterminate}
				<Minus class="h-[15px] w-[15px] text-background" />
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
