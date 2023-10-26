<script lang="ts">
	import { RadioGroup, Label } from "$lib";
</script>

<RadioGroup.Root class="flex flex-col gap-3">
	<div
		class="group select-none cursor-pointer flex items-center gap-3 text-primary/50 [&:has([data-state=checked])]:text-primary transition-colors"
	>
		<RadioGroup.Item
			id="amazing"
			value="amazing"
			class="shrink-0 sq-5 rounded-full border-2 border-primary/40 transition-all data-[state=checked]:group-hover:border-primary data-[state=checked]:border-6 data-[state=checked]:border-primary duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-background/70 ring-offset-1"
		/>
		<Label.Root for="amazing" class="font-medium text-sm">Amazing</Label.Root>
	</div>
	<div
		class="group select-none cursor-pointer flex items-center gap-3 text-primary/50 [&:has([data-state=checked])]:text-primary transition-colors"
	>
		<RadioGroup.Item
			id="average"
			value="average"
			class="shrink-0 sq-5 rounded-full border-2 border-primary/40 transition-all data-[state=checked]:group-hover:border-primary data-[state=checked]:border-6 data-[state=checked]:border-primary duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-background/70 ring-offset-1 "
		/>
		<Label.Root for="average" class="font-medium text-sm">Average</Label.Root>
	</div>
	<div
		class="group select-none cursor-pointer flex items-center gap-3 text-primary/50 [&:has([data-state=checked])]:text-primary transition-colors"
	>
		<RadioGroup.Item
			id="terrible"
			value="terrible"
			class="shrink-0 sq-5 rounded-full border-2 border-primary/40 transition-all data-[state=checked]:group-hover:border-primary data-[state=checked]:border-6 data-[state=checked]:border-primary duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-background/70 ring-offset-1"
		/>
		<Label.Root for="terrible" class="font-medium text-sm">Terrible</Label.Root>
	</div>
</RadioGroup.Root>
