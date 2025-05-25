<script lang="ts">
	import { PinInput, REGEXP_ONLY_DIGITS, type PinInputRootSnippetProps } from "bits-ui";
	import { toast } from "svelte-sonner";
	import { cn } from "$lib/utils/styles.js";

	let value = $state("");

	type CellProps = PinInputRootSnippetProps["cells"][0];

	function onComplete() {
		toast.success(`Completed with value ${value}`);
		value = "";
	}
</script>

<PinInput.Root
	bind:value
	class="group/pininput text-foreground has-disabled:opacity-30 flex items-center"
	maxlength={6}
	{onComplete}
	pattern={REGEXP_ONLY_DIGITS}
>
	{#snippet children({ cells })}
		<div class="flex">
			{#each cells.slice(0, 3) as cell, i (i)}
				{@render Cell(cell)}
			{/each}
		</div>

		<div class="flex w-10 items-center justify-center">
			<div class="bg-border h-1 w-3 rounded-full"></div>
		</div>

		<div class="flex">
			{#each cells.slice(3, 6) as cell, i (i)}
				{@render Cell(cell)}
			{/each}
		</div>
	{/snippet}
</PinInput.Root>

{#snippet Cell(cell: CellProps)}
	<PinInput.Cell
		{cell}
		class={cn(
			// Custom class to override global focus styles
			"focus-override",
			"relative h-14 w-10 text-[2rem]",
			"flex items-center justify-center",
			"transition-all duration-75",
			"border-foreground/20 border-y border-r first:rounded-l-md first:border-l last:rounded-r-md",
			"text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40",
			"outline-0",
			"data-active:outline-1 data-active:outline-white"
		)}
	>
		{#if cell.char !== null}
			<div>
				{cell.char}
			</div>
		{/if}
		{#if cell.hasFakeCaret}
			<div
				class="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center"
			>
				<div class="h-8 w-px bg-white"></div>
			</div>
		{/if}
	</PinInput.Cell>
{/snippet}
