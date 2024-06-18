<script lang="ts">
	import { PinInput, Toggle, type PinInputRootSnippetProps } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";
	import { toast } from "svelte-sonner";
	let value = $state("");

	type CellProps = PinInputRootSnippetProps["cells"][0];

	function onComplete() {
		toast.success("Completed with value " + value);
		value = "";
	}
</script>

<PinInput.Root
	bind:value
	class="group/pininput flex items-center text-foreground has-[:disabled]:opacity-30"
	maxlength={6}
	{onComplete}
>
	{#snippet children({ cells })}
		<div class="flex">
			{#each cells.slice(0, 3) as cell}
				{@render Cell(cell)}
			{/each}
		</div>

		<div class="flex w-10 items-center justify-center">
			<div class="h-1 w-3 rounded-full bg-border"></div>
		</div>

		<div class="flex">
			{#each cells.slice(3, 6) as cell}
				{@render Cell(cell)}
			{/each}
		</div>
	{/snippet}
</PinInput.Root>

{#snippet Cell(props: CellProps )}
	<div
		class={cn(
			// Custom class to override global focus styles
			"focus-override",
			"relative h-14 w-10 text-[2rem]",
			"flex items-center justify-center",
			"transition-all duration-200",
			"border-y border-r border-foreground/20 first:rounded-l-md first:border-l last:rounded-r-md",
			"text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40",
			"outline outline-0",
			props.isActive && "outline-1 outline-white"
		)}
	>
		{#if props.char !== null}
			<div>
				{props.char}
			</div>
		{/if}
		{#if props.hasFakeCaret}
			<div
				class="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center"
			>
				<div class="h-8 w-px bg-white"></div>
			</div>
		{/if}
	</div>
{/snippet}
