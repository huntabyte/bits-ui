<script lang="ts">
	import * as RadioGroup from "@/components/ui/radio-group";
	import * as Label from "@/components/ui/label";
</script>

<RadioGroup.Root value="comfortable">
	<div class="flex items-center space-x-2">
		<RadioGroup.Item value="default" id="r1" />
		<Label.Root for="r1">Default</Label.Root>
	</div>
	<div class="flex items-center space-x-2">
		<RadioGroup.Item value="comfortable" id="r2" />
		<Label.Root for="r2">Comfortable</Label.Root>
	</div>
	<div class="flex items-center space-x-2">
		<RadioGroup.Item value="compact" id="r3" />
		<Label.Root for="r3">Compact</Label.Root>
	</div>
	<RadioGroup.Input name="spacing" />
</RadioGroup.Root>
