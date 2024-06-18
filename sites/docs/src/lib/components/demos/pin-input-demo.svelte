<script lang="ts">
	import { PinInput, Toggle, type PinInputRootSnippetProps } from "bits-ui";
	import { Eye, EyeSlash } from "$icons/index.js";
	import { cn } from "$lib/utils/styles.js";
	import { cell } from "$lib/content/api-reference/calendar.js";

	let value = $state("");

	type CellProps = PinInputRootSnippetProps["cells"][0];
</script>

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
			{@render FakeCaret()}
		{/if}
	</div>
{/snippet}

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

		{@render FakeDash()}

		<div class="flex">
			{#each cells.slice(3, 6) as cell}
				{@render Cell(cell)}
			{/each}
		</div>
	{/snippet}
</PinInput.Root>

<!-- <Toggle.Root
		aria-label="toggle code visibility"
		class="inline-flex size-10 items-center justify-center rounded-[9px] text-foreground/40 transition-all hover:bg-muted active:scale-98 active:bg-dark-10 active:data-[state=on]:bg-dark-10"
		bind:pressed={unlocked}
	>
		{#if unlocked}
			<Eye class="size-5" />
		{:else}
			<EyeSlash class="size-5" />
		{/if}
	</Toggle.Root> -->

<!-- <PinInput.Input
		class="flex h-input w-10 select-none rounded-input border border-foreground bg-background px-2 py-3 text-center font-alt text-[17px] tracking-[0.01em] text-foreground placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
	/>
	<PinInput.Input
		class="flex h-input w-10 select-none rounded-input border border-foreground bg-background px-2 py-3 text-center font-alt text-[17px] tracking-[0.01em] text-foreground placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
	/>
	<PinInput.Input
		class="flex h-input w-10 select-none rounded-input border border-foreground bg-background px-2 py-3 text-center font-alt text-[17px] tracking-[0.01em] text-foreground placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
	/>
	<PinInput.Input
		class="flex h-input w-10 select-none rounded-input border border-foreground bg-background px-2 py-3 text-center font-alt text-[17px] tracking-[0.01em] text-foreground placeholder-shown:border-border-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
	/>
	<PinInput.HiddenInput /> -->

{#snippet FakeCaret()}
	<div
		class="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center"
	>
		<div class="h-8 w-px bg-white"></div>
	</div>
{/snippet}

{#snippet FakeDash()}
	<div class="flex w-10 items-center justify-center">
		<div class="h-1 w-3 rounded-full bg-border"></div>
	</div>
{/snippet}
