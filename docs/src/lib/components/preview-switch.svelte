<script lang="ts">
	import { Switch } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let { class: className, checked = $bindable(false), ...restProps }: Switch.RootProps = $props();
</script>

<Switch.Root
	bind:checked
	class={cn(
		"focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary/60 focus-visible:ring-offset-background shadow-xs focus-visible:outline-hidden peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
>
	<Switch.Thumb
		class={cn(
			"data-[state=checked]:bg-background data-[state=unchecked]:bg-accent pointer-events-none relative inline-block h-4 w-4 transform rounded-full shadow-lg ring-0 transition-all ease-in-out data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
		)}
	/>
</Switch.Root>
