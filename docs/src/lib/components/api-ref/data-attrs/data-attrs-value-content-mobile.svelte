<script lang="ts">
	import { Popover, Separator } from "bits-ui";
	import ScrollArea from "#lib/components/ui/scroll-area.svelte";
	import type { DataAttrSchema } from "#lib/types/index.js";
	import Info from "phosphor-svelte/lib/Info";
	import Code from "#lib/components/markdown/code.svelte";
	import { parseMarkdown } from "#lib/utils/markdown.js";
	import PopoverContent from "#lib/components/ui/popover/popover-content.svelte";

	let { attr }: { attr: DataAttrSchema } = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		data-llm-ignore
		class="extend-touch-target inline-flex h-full w-full items-center justify-end rounded-button px-2 py-3 text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden"
	>
		<Info class="size-4" weight="bold" />
		<span class="sr-only">See type definition</span>
	</Popover.Trigger>
	<PopoverContent
		preventScroll={false}
		side="left"
		sideOffset={-6}
		align="center"
		class="flex max-h-[80vh] w-[85vw] max-w-[85vw] flex-col gap-4"
		avoidCollisions={true}
		collisionPadding={{ top: 70 }}
		onCloseAutoFocus={(e) => e.preventDefault()}
		trapFocus={false}
	>
		<div class="flex w-full">
			<span class="font-semibold">
				data-{attr.name}
			</span>
		</div>

		{#if attr.variant === "simple"}
			<Code class="h-auto w-full justify-start px-2 py-2 text-start text-sm">
				{attr.value}
			</Code>
		{:else}
			<ScrollArea
				type="scroll"
				class="flex max-h-[200px] min-w-full rounded-button bg-muted p-2"
				scrollbarXProps={{ class: "h-1.5" }}
				scrollbarYProps={{ class: "w-1.5" }}
			>
				<div
					class="w-full !text-xs **:data-line:pr-2.5! [&_[data-line]]:!pl-0 [&_[data-line]]:!text-xs [&_code]:text-start [&_pre]:my-0! [&_pre]:mt-0 [&_pre]:mb-0! [&_pre]:overflow-x-visible! [&_pre]:border-0 [&_pre]:p-0 [&_pre]:pt-0! [&_pre]:pb-0! [&_pre]:ring-0! [&_pre]:ring-offset-0! [&_pre]:outline-hidden!"
				>
					<attr.value />
				</div>
			</ScrollArea>
		{/if}
		<Separator.Root class="!h-px w-full bg-border dark:bg-dark-10 " />

		<div class="flex w-full flex-col gap-2">
			<span class="text-left font-semibold text-foreground">Description</span>
			<ScrollArea
				type="scroll"
				class="max-h-[200px] min-w-full p-0 text-left text-sm leading-relaxed text-foreground/85"
				scrollbarXProps={{ class: "h-1.5" }}
				scrollbarYProps={{ class: "w-1.5 -mr-2" }}
			>
				<div class="w-full pr-[2.5px] leading-7">
					{@html parseMarkdown(attr.description)}
				</div>
			</ScrollArea>
		</div>
	</PopoverContent>
</Popover.Root>
