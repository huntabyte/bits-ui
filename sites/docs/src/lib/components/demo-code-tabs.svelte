<script lang="ts">
	import { Tabs } from "bits-ui";
	import type { Snippet } from "svelte";
	import CopySimple from "phosphor-svelte/lib/CopySimple";
	import { cn } from "$lib/utils/styles.js";

	type Props = {
		value?: string;
		items: { value: string; label: string }[];
		children: Snippet;
		open: boolean;
	};

	let { value = $bindable(), open = $bindable(), items, children }: Props = $props();
</script>

<Tabs.Root {value}>
	<div class="flex items-center justify-between border-x-2 pb-2 pt-1">
		<Tabs.List class="flex items-center">
			{#each items as item}
				<Tabs.Trigger
					value={item.value}
					class="flex select-none border-b-2 border-b-transparent text-sm data-[state=active]:border-accent"
				>
					<span class="px-4 py-2">
						{item.label}
					</span>
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<div class="flex items-center gap-2 border-b-2 border-transparent pr-2 text-sm">
			<button
				class={cn(
					"inline-flex select-none items-center justify-center whitespace-nowrap rounded-[7px] px-2.5 py-1.5 text-sm text-foreground ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				)}
				onclick={() => (open = !open)}
				aria-label="Toggle code expansion"
			>
				{open ? "Collapse" : "Expand"} Code
			</button>
			<button
				class={cn(
					"relative inline-flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				)}
				aria-label="Copy"
				data-copy-code
			>
				<CopySimple class="size-4" />
			</button>
		</div>
	</div>
	{@render children()}
</Tabs.Root>
