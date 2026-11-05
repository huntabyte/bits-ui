<script lang="ts">
	import { Tooltip, Toolbar, Separator } from "bits-ui";
	import TextB from "phosphor-svelte/lib/TextB";
	import TextItalic from "phosphor-svelte/lib/TextItalic";
	import TextStrikethrough from "phosphor-svelte/lib/TextStrikethrough";
	import TextAlignLeft from "phosphor-svelte/lib/TextAlignLeft";
	import TextAlignCenter from "phosphor-svelte/lib/TextAlignCenter";
	import TextAlignRight from "phosphor-svelte/lib/TextAlignRight";
	import Sparkle from "phosphor-svelte/lib/Sparkle";

	let text = $state<string[]>([]);
	let align = $state<string>("center");
</script>

{#snippet tooltipContent({ content }: { content: string })}
	<Tooltip.Content
		class="z-50 flex origin-(--bits-tooltip-content-transform-origin) animate-in items-center justify-center rounded-input border border-dark-10 bg-background p-3 text-sm font-medium shadow-popover outline-hidden fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
		sideOffset={8}
	>
		{content}
	</Tooltip.Content>
{/snippet}

<Tooltip.Provider delayDuration={200}>
	<Toolbar.Root
		class="flex h-12 min-w-max items-center justify-center rounded-10px border border-border bg-background-alt px-[4px] py-1 shadow-mini"
	>
		<Toolbar.Group bind:value={text} type="multiple" class="flex items-center gap-x-0.5">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						{@const { "data-state": _state, ...rest } = props}
						<Toolbar.GroupItem
							aria-label="toggle bold"
							value="bold"
							class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-[0.98] active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
							{...rest}
						>
							<TextB class="size-6" />
						</Toolbar.GroupItem>
					{/snippet}
				</Tooltip.Trigger>
				{@render tooltipContent({ content: "Bold" })}
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						{@const { "data-state": _state, ...rest } = props}
						<Toolbar.GroupItem
							aria-label="toggle italic"
							value="italic"
							class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-[0.98] active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
							{...rest}
						>
							<TextItalic class="size-6" />
						</Toolbar.GroupItem>
					{/snippet}
				</Tooltip.Trigger>
				{@render tooltipContent({ content: "Italic" })}
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						{@const { "data-state": _state, ...rest } = props}
						<Toolbar.GroupItem
							aria-label="toggle strikethrough"
							value="strikethrough"
							class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-[0.98] active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
							{...rest}
						>
							<TextStrikethrough class="size-6" />
						</Toolbar.GroupItem>
					{/snippet}
				</Tooltip.Trigger>
				{@render tooltipContent({ content: "Strikethrough" })}
			</Tooltip.Root>
		</Toolbar.Group>

		<Separator.Root class="mx-1 -my-1 w-[1px] self-stretch bg-dark-10" />

		<Toolbar.Group bind:value={align} type="single" class="flex items-center gap-x-0.5">
			<Toolbar.GroupItem
				aria-label="align left"
				value="left"
				class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-[0.98] active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
			>
				<TextAlignLeft class="size-6" />
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				aria-label="align center"
				value="center"
				class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-[0.98] active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
			>
				<TextAlignCenter class="size-6" />
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				aria-label="align right"
				value="right"
				class="inline-flex size-10 items-center justify-center rounded-9px bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-[0.98] active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10"
			>
				<TextAlignRight class="size-6" />
			</Toolbar.GroupItem>
		</Toolbar.Group>

		<Separator.Root class="mx-1 -my-1 w-[1px] self-stretch bg-dark-10" />

		<div class="flex items-center">
			<Toolbar.Button
				class="inline-flex items-center justify-center rounded-9px px-3 py-2 text-sm  font-medium text-foreground/80 transition-all hover:bg-muted active:scale-[0.98] active:bg-dark-10"
			>
				<Sparkle class="mr-2 size-6" />
				<span> Ask AI </span>
			</Toolbar.Button>
		</div>
	</Toolbar.Root>
</Tooltip.Provider>
