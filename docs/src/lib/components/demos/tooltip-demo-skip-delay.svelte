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
		class="rounded-10px border-border bg-background-alt shadow-mini inline-flex items-center gap-0.5 border p-1"
	>
		{#each tools as tool, i (tool.label)}
			{#if i === 4}
				<div class="bg-border mx-0.5 h-5 w-px shrink-0"></div>
			{/if}
			<Tooltip.Root>
				<Tooltip.Trigger
					class="rounded-9px text-foreground/70 hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground inline-flex size-8 items-center justify-center transition-colors"
				>
					<tool.icon class="size-4" weight="bold" />
				</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Content
						sideOffset={8}
						class="data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin)"
					>
						<div
							class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden flex items-center gap-2 border px-2.5 py-1.5"
						>
							<span class="text-sm font-medium">{tool.label}</span>
							<kbd
								class="rounded-[4px] border-dark-10 text-foreground/50 bg-background-alt border px-1.5 py-0.5 font-mono text-[11px] leading-none"
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
