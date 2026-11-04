<script lang="ts">
	import { Label, RadioGroup } from "bits-ui";
</script>

<RadioGroup.Root
	value="average"
	readonly
	class="flex flex-col gap-4 text-sm font-medium opacity-75"
>
	<div class="group flex items-center text-foreground transition-all select-none">
		<RadioGroup.Item
			id="readonly-amazing"
			value="amazing"
			class="size-5 shrink-0 cursor-default rounded-full border border-border-input bg-background transition-all duration-100 ease-in-out hover:border-dark-40 data-readonly:pointer-events-none data-[state=checked]:border-6 data-[state=checked]:border-foreground"
		/>
		<Label.Root for="readonly-amazing" class="pl-3">Amazing</Label.Root>
	</div>
	<div class="group flex items-center text-foreground transition-all select-none">
		<RadioGroup.Item
			id="readonly-average"
			value="average"
			class="size-5 shrink-0 cursor-default rounded-full border border-border-input bg-background transition-all duration-100 ease-in-out hover:border-dark-40 data-readonly:pointer-events-none data-[state=checked]:border-6 data-[state=checked]:border-foreground"
		/>
		<Label.Root for="readonly-average" class="pl-3">Average</Label.Root>
	</div>
	<div class="group flex items-center text-foreground transition-all select-none">
		<RadioGroup.Item
			id="readonly-terrible"
			value="terrible"
			class="size-5 shrink-0 cursor-default rounded-full border border-border-input bg-background transition-all duration-100 ease-in-out hover:border-dark-40 data-readonly:pointer-events-none data-[state=checked]:border-6 data-[state=checked]:border-foreground"
		/>
		<Label.Root for="readonly-terrible" class="pl-3">Terrible</Label.Root>
	</div>
</RadioGroup.Root>
