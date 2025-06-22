<script lang="ts">
	import { Label, RadioGroup } from "bits-ui";
</script>

<RadioGroup.Root class="flex flex-col gap-4 text-sm font-medium">
	<div class="text-foreground group flex select-none items-center transition-all">
		<RadioGroup.Item
			id="amazing"
			value="amazing"
			class="border-border-input bg-background hover:border-dark-40 data-[state=checked]:border-foreground data-[state=checked]:border-6 size-5 shrink-0 cursor-default rounded-full border transition-all duration-100 ease-in-out"
		/>
		<Label.Root for="amazing" class="pl-3">Amazing</Label.Root>
	</div>
	<div class="text-foreground group flex select-none items-center transition-all">
		<RadioGroup.Item
			id="average"
			value="average"
			class="border-border-input bg-background hover:border-dark-40 data-[state=checked]:border-foreground data-[state=checked]:border-6 size-5 shrink-0 cursor-default rounded-full border transition-all duration-100 ease-in-out"
		/>
		<Label.Root for="average" class="pl-3">Average</Label.Root>
	</div>
	<div class="text-foreground group flex select-none items-center transition-all">
		<RadioGroup.Item
			id="terrible"
			value="terrible"
			class="border-border-input bg-background hover:border-dark-40 data-[state=checked]:border-foreground data-[state=checked]:border-6 size-5 shrink-0 cursor-default rounded-full border transition-all duration-100 ease-in-out"
		/>
		<Label.Root for="terrible" class="pl-3">Terrible</Label.Root>
	</div>
</RadioGroup.Root>
