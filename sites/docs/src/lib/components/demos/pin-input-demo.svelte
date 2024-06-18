<script lang="ts">
	import { PinInput, Toggle, type PinInputRootSnippetProps } from "bits-ui";
	import { cn } from "$lib/utils/styles.js";

	let value = $state("");

	type CellProps = PinInputRootSnippetProps["cells"][0];
</script>

<PinInput.Root
	bind:value
	class="group flex items-center text-foreground has-[:disabled]:opacity-30"
	maxlength={6}
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
			"relative h-14 w-10 text-[2rem]",
			"flex items-center justify-center",
			"transition-all duration-300",
			"border-y border-r border-border first:rounded-l-md first:border-l last:rounded-r-md",
			"text-foreground group-focus-within:border-accent-foreground/20 group-hover:border-accent-foreground/20",
			"outline outline-0 outline-accent-foreground/20",
			{ "outline-4 outline-accent-foreground": props.isActive }
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
