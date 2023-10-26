<script lang="ts">
	import { Switch } from "@/lib";
	import { cn } from "@/utils";

	type $$Props = Switch.Props;
	type $$Events = Switch.Events;

	let className: $$Props["class"] = undefined;
	export let checked: $$Props["checked"] = undefined;
	export { className as class };
</script>

<Switch.Root
	bind:checked
	class={cn(
		"peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary/60",
		className
	)}
	on:click
	on:keydown
>
	<Switch.Thumb
		class={cn(
			"pointer-events-none relative inline-block h-4 w-4 rounded-full data-[state=unchecked]:bg-accent shadow-lg ring-0 transition-all transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-4 ease-in-out data-[state=checked]:bg-background"
		)}
	/>
</Switch.Root>
