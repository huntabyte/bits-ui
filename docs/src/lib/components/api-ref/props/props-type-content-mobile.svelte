<script lang="ts">
	import { Popover, Separator } from "bits-ui";
	import ScrollArea from "$lib/components/scroll-area.svelte";
	import type { PropSchema } from "$lib/types/index.js";
	import Info from "phosphor-svelte/lib/Info";
	import PropsRequiredBadge from "./props-required-badge.svelte";
	import PropsBindableBadge from "./props-bindable-badge.svelte";
	import Code from "$lib/components/markdown/code.svelte";
	import { parseMarkdown } from "$lib/utils/markdown.js";
	import PopoverContent from "$lib/components/ui/popover/popover-content.svelte";

	let { prop }: { prop: PropSchema & { name: string } } = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		data-llm-ignore
		class="rounded-button text-muted-foreground focus-visible:ring-foreground focus-visible:ring-offset-background extend-touch-target focus-visible:outline-hidden inline-flex h-full w-full items-center justify-end px-2 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
	>
		<Info class="size-4" weight="bold" />
		<span class="sr-only">See type definition</span>
	</Popover.Trigger>
	<PopoverContent
		preventScroll={false}
		side="left"
		sideOffset={0}
		align="center"
		class="flex max-h-[80vh] w-[85vw] max-w-[85vw] flex-col gap-4"
		avoidCollisions={true}
		collisionPadding={{ top: 70 }}
		onCloseAutoFocus={(e) => e.preventDefault()}
		trapFocus={false}
	>
		<div class="flex w-full items-center justify-between gap-2">
			<span class="font-semibold">
				{prop.name}
			</span>
			<div class="flex items-center gap-1.5">
				{#if prop.required}
					<PropsRequiredBadge />
				{/if}
				{#if prop.bindable}
					<PropsBindableBadge />
				{/if}
			</div>
		</div>

		{#if prop.type.variant === "simple"}
			<Code class="h-auto w-full justify-start px-2 py-2 text-start text-sm">
				{prop.type.type}
			</Code>
		{:else}
			<ScrollArea
				type="scroll"
				class="bg-muted rounded-button flex max-h-[200px] min-w-full p-2"
				scrollbarXProps={{ class: "h-1.5" }}
				scrollbarYProps={{ class: "w-1.5" }}
			>
				<div
					class="**:data-line:pr-2.5! [&_pre]:my-0! [&_pre]:mb-0! [&_pre]:overflow-x-visible! [&_pre]:pt-0! [&_pre]:pb-0! [&_pre]:ring-0! [&_pre]:ring-offset-0! [&_pre]:outline-hidden! w-full !text-xs [&_[data-line]]:!pl-0 [&_[data-line]]:!text-xs [&_code]:text-start [&_pre]:mt-0 [&_pre]:border-0 [&_pre]:p-0"
				>
					<prop.type.definition />
				</div>
			</ScrollArea>
		{/if}
		<Separator.Root class="dark:bg-dark-10 bg-border !h-px w-full " />

		<div class="flex w-full flex-col gap-2">
			<span class="text-foreground text-left font-semibold">Description</span>
			<ScrollArea
				type="scroll"
				class="text-foreground/85 max-h-[200px] min-w-full p-0 text-left text-sm leading-relaxed"
				scrollbarXProps={{ class: "h-1.5" }}
				scrollbarYProps={{ class: "w-1.5 -mr-2" }}
			>
				<div class="w-full pr-[2.5px] leading-7">
					{@html parseMarkdown(prop.description)}
				</div>
			</ScrollArea>
		</div>
	</PopoverContent>
</Popover.Root>
