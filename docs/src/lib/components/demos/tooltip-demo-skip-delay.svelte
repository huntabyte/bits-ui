<script lang="ts">
	import { Tooltip } from "bits-ui";
	import TextB from "phosphor-svelte/lib/TextB";
	import TextItalic from "phosphor-svelte/lib/TextItalic";
	import TextUnderline from "phosphor-svelte/lib/TextUnderline";
	import TextStrikethrough from "phosphor-svelte/lib/TextStrikethrough";
	import Link from "phosphor-svelte/lib/Link";
	import ListBullets from "phosphor-svelte/lib/ListBullets";
	import ListNumbers from "phosphor-svelte/lib/ListNumbers";
	import Code from "phosphor-svelte/lib/Code";

	const tools = [
		{ icon: TextB, label: "Bold", shortcut: "⌘B" },
		{ icon: TextItalic, label: "Italic", shortcut: "⌘I" },
		{ icon: TextUnderline, label: "Underline", shortcut: "⌘U" },
		{ icon: TextStrikethrough, label: "Strikethrough", shortcut: "⌘⇧X" },
		{ icon: Link, label: "Link", shortcut: "⌘K" },
		{ icon: ListBullets, label: "Bullet list", shortcut: "⌘⇧8" },
		{ icon: ListNumbers, label: "Numbered list", shortcut: "⌘⇧7" },
		{ icon: Code, label: "Code", shortcut: "⌘E" },
	];
</script>

<Tooltip.Provider delayDuration={600} skipDelayDuration={200}>
	<div
		class="inline-flex items-center gap-0.5 rounded-10px border border-border bg-background-alt p-1 shadow-mini"
	>
		{#each tools as tool, i (tool.label)}
			{#if i === 4}
				<div class="mx-0.5 h-5 w-px shrink-0 bg-border"></div>
			{/if}
			<Tooltip.Root>
				<Tooltip.Trigger
					class="inline-flex size-8 items-center justify-center rounded-9px text-foreground/70 transition-colors hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
				>
					<tool.icon class="size-4" weight="bold" />
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						sideOffset={8}
						class="z-50 origin-(--bits-tooltip-content-transform-origin) data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95"
					>
						<div
							class="flex items-center gap-2 rounded-input border border-dark-10 bg-background px-2.5 py-1.5 shadow-popover outline-hidden"
						>
							<span class="text-sm font-medium">{tool.label}</span>
							<kbd
								class="rounded-[4px] border border-dark-10 bg-background-alt px-1.5 py-0.5 font-mono text-[11px] leading-none text-foreground/50"
							>
								{tool.shortcut}
							</kbd>
						</div>
					</Tooltip.Content>
				</Tooltip.Portal>
			</Tooltip.Root>
		{/each}
	</div>
</Tooltip.Provider>
