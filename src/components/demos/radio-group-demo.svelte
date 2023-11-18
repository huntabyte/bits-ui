<script lang="ts">
	import { RadioGroup, Label } from "$lib";
</script>

<RadioGroup.Root class="flex flex-col gap-3">
	<div
		class="text-primary/50 [&:has([data-state=checked])]:text-primary group flex cursor-pointer select-none items-center gap-3 transition-colors"
	>
		<RadioGroup.Item
			id="amazing"
			value="amazing"
			class="border-primary/40 data-[state=checked]:group-hover:border-primary data-[state=checked]:border-primary shrink-0 rounded-full border-2 ring-offset-1 transition-all duration-200 sq-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-background/70 data-[state=checked]:border-6"
		/>
		<Label.Root for="amazing" class="text-sm font-medium">Amazing</Label.Root>
	</div>
	<div
		class="text-primary/50 [&:has([data-state=checked])]:text-primary group flex cursor-pointer select-none items-center gap-3 transition-colors"
	>
		<RadioGroup.Item
			id="average"
			value="average"
			class="border-primary/40 data-[state=checked]:group-hover:border-primary data-[state=checked]:border-primary shrink-0 rounded-full border-2 ring-offset-1 transition-all duration-200 sq-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-background/70 data-[state=checked]:border-6 "
		/>
		<Label.Root for="average" class="text-sm font-medium">Average</Label.Root>
	</div>
	<div
		class="text-primary/50 [&:has([data-state=checked])]:text-primary group flex cursor-pointer select-none items-center gap-3 transition-colors"
	>
		<RadioGroup.Item
			id="terrible"
			value="terrible"
			class="border-primary/40 data-[state=checked]:group-hover:border-primary data-[state=checked]:border-primary shrink-0 rounded-full border-2 ring-offset-1 transition-all duration-200 sq-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-background/70 data-[state=checked]:border-6"
		/>
		<Label.Root for="terrible" class="text-sm font-medium">Terrible</Label.Root>
	</div>
</RadioGroup.Root>
