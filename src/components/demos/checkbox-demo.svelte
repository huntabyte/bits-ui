<script lang="ts">
	import * as Checkbox from "@/components/ui/checkbox";
	import * as Label from "@/components/ui/label";
	let checked = false;
</script>

<div class="flex items-center space-x-2">
	<Checkbox.Root id="terms" bind:checked aria-labelledby="terms-label" />
	<Label.Root
		id="terms-label"
		for="terms"
		class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		Accept terms and conditions
	</Label.Root>
</div>
