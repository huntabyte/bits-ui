<script lang="ts">
	import { PinInput, type PinInputRootSnippetProps } from "bits-ui";

	let {
		onComplete = () => {},
		maxlength = 6,
		value = "",
		toCopy,
		countCompletions = false,
		...restProps
	}: Omit<PinInput.RootProps, "children"> & {
		toCopy?: string;
		countCompletions?: boolean;
	} = $props();

	let completions = $state(0);

	let inputRef = $state<HTMLInputElement | null>(null);

	type CellProps = PinInputRootSnippetProps["cells"][0];
</script>

<main>
	<button aria-label="binding" data-testid="binding" onclick={() => (value = "999999")}>
		{value}
	</button>

	<button type="button" data-testid="focus-input" onclick={() => inputRef?.focus()}>
		focus input
	</button>

	<PinInput.Root
		aria-label="my input"
		inputId="myInput"
		bind:inputRef
		bind:value
		class="group/pininput flex items-center text-foreground has-[:disabled]:opacity-30"
		{maxlength}
		onComplete={countCompletions
			? (v: string) => {
					// reads and writes state, like `form.requestSubmit()` on a remote form
					completions++;
					onComplete(v);
				}
			: onComplete}
		data-testid="input"
		{...restProps}
	>
		{#snippet children({ cells, isFocused: _isFocused, isHovering: _isHovering })}
			<div class="flex">
				{#each cells.slice(0, 3) as cell, idx (idx)}
					{@render Cell(cell, idx)}
				{/each}
			</div>

			<div class="flex w-10 items-center justify-center">
				<div class="h-1 w-3 rounded-full bg-border"></div>
			</div>

			<div class="flex">
				{#each cells.slice(3, 6) as cell, idx (idx)}
					{@render Cell(cell, idx + 3)}
				{/each}
			</div>
		{/snippet}
	</PinInput.Root>
	<div data-testid="completions">{completions}</div>
	<div data-testid="to-copy">
		{toCopy}
	</div>
</main>

{#snippet Cell(props: CellProps, idx: number)}
	<div data-testid="cell-{idx}" data-active={props.isActive ? "" : undefined}>
		{#if props.char !== null}
			{props.char}
		{/if}
		{#if props.hasFakeCaret}
			<div
				class="pointer-events-none absolute inset-0 flex animate-caret-blink items-center justify-center"
				data-testid="caret-{idx}"
			>
				<div class="h-8 w-px bg-white"></div>
			</div>
		{/if}
	</div>
{/snippet}
