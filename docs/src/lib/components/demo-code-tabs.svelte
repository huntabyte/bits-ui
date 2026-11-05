<script lang="ts">
	import { Collapsible, Tabs } from "bits-ui";
	import type { Snippet } from "svelte";
	import CopySimple from "phosphor-svelte/lib/CopySimple";
	import Check from "phosphor-svelte/lib/Check";
	import { cn } from "#lib/utils/styles.js";
	import { useCopyToClipboard } from "#lib/utils/copy-to-clipboard.svelte.js";

	let {
		value = $bindable(),
		open = $bindable(),
		ref = $bindable(null),
		onValueChange = () => {},
		items,
		expandable = true,
		variant = "preview",
		children,
	}: {
		value?: string;
		onValueChange?: (value: string) => void;
		items: { value: string; label: string }[];
		children: Snippet;
		open: boolean;
		expandable?: boolean;
		ref?: HTMLElement | null;
		variant?: "preview" | "collapsed";
	} = $props();

	const copyToClipboard = useCopyToClipboard();
</script>

<Tabs.Root {value} {onValueChange}>
	{#if variant === "preview" || open}
		<div class="flex items-center justify-between border-x-2 pt-1 pb-2">
			<Tabs.List class="flex items-center" data-llm-ignore>
				{#each items as item (item.value)}
					<Tabs.Trigger
						value={item.value}
						class="flex border-b-2 border-b-transparent text-sm text-foreground-alt select-none data-[state=active]:border-foreground-alt  data-[state=active]:text-foreground"
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
					<Collapsible.Trigger
						class={cn(
							"hidden items-center justify-center rounded-[7px] px-2.5 py-1.5 text-sm whitespace-nowrap text-foreground ring-offset-background transition-colors select-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden sm:inline-flex"
						)}
						aria-label="Toggle code expansion"
					>
						{open ? "Collapse" : "Expand"} Code
					</Collapsible.Trigger>
				{/if}
				<button
					class={cn(
						"relative inline-flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
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
	{:else}
		<Collapsible.Trigger
			class="flex w-full items-center justify-center rounded-b-card border-2 border-t-0 bg-background py-3 text-sm font-medium text-foreground-alt transition-colors duration-100 hover:bg-muted/15 hover:text-foreground"
		>
			Expand Code
		</Collapsible.Trigger>
		<div class="hidden">
			{@render children()}
		</div>
	{/if}
</Tabs.Root>
