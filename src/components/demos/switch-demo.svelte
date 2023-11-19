<script lang="ts">
	import { Switch, Label } from "$lib";
</script>

<div class="flex items-center space-x-3">
	<Switch.Root
		id="marketing"
		class="peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-mini-inset transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-muted"
	>
		<Switch.Thumb
			class="pointer-events-none block h-6 w-6 rounded-full bg-background shadow-mini ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
		/>
	</Switch.Root>
	<Label.Root for="marketing" class="text-sm font-medium"
		>Do not disturb</Label.Root
	>
</div>
