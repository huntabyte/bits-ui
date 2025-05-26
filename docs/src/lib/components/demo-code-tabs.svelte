<script lang="ts">
	import { Tabs } from "bits-ui";
	import type { Snippet } from "svelte";
	import CopySimple from "phosphor-svelte/lib/CopySimple";
	import Check from "phosphor-svelte/lib/Check";
	import { cn } from "$lib/utils/styles.js";
	import { useCopyToClipboard } from "$lib/utils/copy-to-clipboard.svelte.js";

	let {
		value = $bindable(),
		open = $bindable(),
		ref = $bindable(null),
		onValueChange = () => {},
		items,
		expandable = true,
		children,
	}: {
		value?: string;
		onValueChange?: (value: string) => void;
		items: { value: string; label: string }[];
		children: Snippet;
		open: boolean;
		expandable?: boolean;
		ref?: HTMLElement | null;
	} = $props();

	const copyToClipboard = useCopyToClipboard();
</script>

<Tabs.Root {value} {onValueChange}>
	<div class="flex items-center justify-between border-x-2 pb-2 pt-1">
		<Tabs.List class="flex items-center" data-llm-ignore>
			{#each items as item (item.value)}
				<Tabs.Trigger
					value={item.value}
					class="text-foreground-alt data-[state=active]:border-foreground-alt data-[state=active]:text-foreground flex select-none border-b-2 border-b-transparent  text-sm"
				>
					<span class="px-4 py-2">
						{item.label}
					</span>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<div
			class="flex items-center gap-2 border-b-2 border-transparent pr-2 text-sm"
			data-llm-ignore
		>
			{#if expandable}
				<button
					class={cn(
						"text-foreground ring-offset-background hover:bg-muted focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden hidden select-none items-center justify-center whitespace-nowrap rounded-[7px] px-2.5 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 sm:inline-flex"
					)}
					onclick={() => (open = !open)}
					aria-label="Toggle code expansion"
				>
					{open ? "Collapse" : "Expand"} Code
				</button>
			{/if}
			<button
				class={cn(
					"text-muted-foreground hover:bg-muted focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden relative inline-flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
				)}
				aria-label="Copy"
				data-copy-code
				onclick={() => copyToClipboard?.copyToClipboard()}
			>
				{#if !copyToClipboard || !copyToClipboard.isCopied}
					<CopySimple class="size-4" />
				{:else}
					<Check class="size-4" />
				{/if}
			</button>
		</div>
	</div>
	<div style="display: contents;" bind:this={ref}>
		{@render children()}
	</div>
</Tabs.Root>
