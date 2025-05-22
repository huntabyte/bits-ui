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
		class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 flex items-center justify-center border p-3 text-sm font-medium"
		sideOffset={8}
	>
		{content}
	</Tooltip.Content>
{/snippet}

<Tooltip.Provider delayDuration={200}>
	<Toolbar.Root
		class="rounded-10px border-border bg-background-alt shadow-mini flex h-12 min-w-max items-center justify-center border px-[4px] py-1"
	>
		<Toolbar.Group bind:value={text} type="multiple" class="flex items-center gap-x-0.5">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						{@const { "data-state": _state, ...rest } = props}
						<Toolbar.GroupItem
							aria-label="toggle bold"
							value="bold"
							class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
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
							class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
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
							class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
							{...rest}
						>
							<TextStrikethrough class="size-6" />
						</Toolbar.GroupItem>
					{/snippet}
				</Tooltip.Trigger>
				{@render tooltipContent({ content: "Strikethrough" })}
			</Tooltip.Root>
		</Toolbar.Group>

		<Separator.Root class="bg-dark-10 -my-1 mx-1 w-[1px] self-stretch" />

		<Toolbar.Group bind:value={align} type="single" class="flex items-center gap-x-0.5">
			<Toolbar.GroupItem
				aria-label="align left"
				value="left"
				class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
			>
				<TextAlignLeft class="size-6" />
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				aria-label="align center"
				value="center"
				class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
			>
				<TextAlignCenter class="size-6" />
			</Toolbar.GroupItem>
			<Toolbar.GroupItem
				aria-label="align right"
				value="right"
				class="rounded-9px bg-background-alt text-foreground/60 hover:bg-muted active:bg-dark-10 data-[state=on]:bg-muted data-[state=on]:text-foreground/80 active:data-[state=on]:bg-dark-10 inline-flex size-10 items-center justify-center transition-all active:scale-[0.98]"
			>
				<TextAlignRight class="size-6" />
			</Toolbar.GroupItem>
		</Toolbar.Group>

		<Separator.Root class="bg-dark-10 -my-1 mx-1 w-[1px] self-stretch" />

		<div class="flex items-center">
			<Toolbar.Button
				class="rounded-9px text-foreground/80 hover:bg-muted active:bg-dark-10 inline-flex items-center justify-center  px-3 py-2 text-sm font-medium transition-all active:scale-[0.98]"
			>
				<Sparkle class="mr-2 size-6" />
				<span> Ask AI </span>
			</Toolbar.Button>
		</div>
	</Toolbar.Root>
</Tooltip.Provider>
