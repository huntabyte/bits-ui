<script lang="ts">
	import { NumberInput } from "bits-ui";
</script>

<div class="flex flex-col gap-4">
	<NumberInput.Root
		class="inline-flex h-input w-[296px] select-none items-center rounded-9px border border-border-input bg-background px-[11px] text-sm transition-colors placeholder:text-foreground-alt/50"
	/>
	<NumberInput.Root
		currency="USD"
		currencyDisplay="symbol"
		mode="currency"
		minFractionDigits={2}
		allowEmpty={true}
		class="inline-flex h-input w-[296px] select-none items-center rounded-9px border border-border-input bg-background px-[11px] text-sm transition-colors placeholder:text-foreground-alt/50"
	/>
</div>
