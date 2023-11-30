<script lang="ts">
	import { RadioGroup, Label } from "$lib";
</script>

<RadioGroup.Root class="flex flex-col gap-4 text-sm font-medium">
	<div
		class="group flex cursor-pointer select-none items-center gap-3 text-foreground/50 transition-colors [&:has([data-state=checked])]:text-foreground"
	>
		<RadioGroup.Item
			id="amazing"
			value="amazing"
			class="shrink-0 rounded-full border-2 border-foreground/40 ring-offset-1 transition-all duration-200 sq-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70 data-[state=checked]:border-6 data-[state=checked]:border-foreground data-[state=checked]:group-hover:border-foreground"
		/>
		<Label.Root for="amazing">Amazing</Label.Root>
	</div>
	<div
		class="group flex cursor-pointer select-none items-center gap-3 text-foreground/50 transition-colors [&:has([data-state=checked])]:text-foreground"
	>
		<RadioGroup.Item
			id="average"
			value="average"
			class="shrink-0 rounded-full border-2 border-foreground/40 ring-offset-1 transition-all duration-200 sq-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70 data-[state=checked]:border-6 data-[state=checked]:border-foreground data-[state=checked]:group-hover:border-foreground "
		/>
		<Label.Root for="average">Average</Label.Root>
	</div>
	<div
		class="group flex cursor-pointer select-none items-center gap-3 text-foreground/50 transition-colors [&:has([data-state=checked])]:text-foreground"
	>
		<RadioGroup.Item
			id="terrible"
			value="terrible"
			class="shrink-0 rounded-full border-2 border-foreground/40 ring-offset-1 transition-all duration-200 sq-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/70 data-[state=checked]:border-6 data-[state=checked]:border-foreground data-[state=checked]:group-hover:border-foreground"
		/>
		<Label.Root for="terrible">Terrible</Label.Root>
	</div>
</RadioGroup.Root>
