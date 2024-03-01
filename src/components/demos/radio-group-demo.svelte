<script lang="ts">
	import { RadioGroup, Label } from "$lib/index.js";
</script>

<RadioGroup.Root class="flex flex-col gap-4 text-sm font-medium">
	<div class="group flex select-none items-center text-foreground transition-all">
		<RadioGroup.Item
			id="amazing"
			value="amazing"
			class="size-5 shrink-0 cursor-default rounded-full border border-border-input bg-background transition-all duration-100 ease-in-out hover:border-dark-40 data-[state=checked]:border-6 data-[state=checked]:border-foreground"
		/>
		<Label.Root for="amazing" class="pl-3">Amazing</Label.Root>
	</div>
	<div class="group flex select-none items-center text-foreground transition-all">
		<RadioGroup.Item
			id="average"
			value="average"
			class="size-5 shrink-0 cursor-default rounded-full border border-border-input bg-background transition-all duration-100 ease-in-out hover:border-dark-40 data-[state=checked]:border-6 data-[state=checked]:border-foreground"
		/>
		<Label.Root for="average" class="pl-3">Average</Label.Root>
	</div>
	<div class="group flex select-none items-center text-foreground transition-all">
		<RadioGroup.Item
			id="terrible"
			value="terrible"
			class="size-5 shrink-0 cursor-default rounded-full border border-border-input bg-background transition-all duration-100 ease-in-out hover:border-dark-40 data-[state=checked]:border-6 data-[state=checked]:border-foreground"
		/>
		<Label.Root for="terrible" class="pl-3">Terrible</Label.Root>
	</div>
</RadioGroup.Root>
