<script lang="ts">
	import { Popover, Separator } from "bits-ui";
	import ScrollArea from "$lib/components/scroll-area.svelte";
	import { parseMarkdown } from "$lib/utils/index.js";
	import PopoverContent from "$lib/components/ui/popover/popover-content.svelte";
	import Info from "phosphor-svelte/lib/Info";
	import type { CSSVarSchema } from "$lib/content/types.js";

	let { cssVar }: { cssVar: CSSVarSchema } = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		data-llm-ignore
		class="rounded-button text-muted-foreground focus-visible:ring-foreground focus-visible:ring-offset-background extend-touch-target focus-visible:outline-hidden inline-flex h-full w-full items-center justify-end px-2 py-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
	>
		<Info class="size-4" weight="bold" />
		<span class="sr-only">CSS Variable details</span>
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
		<div class="flex w-full items-center">
			<span class="text-sm font-semibold">
				{cssVar.name}
			</span>
		</div>

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
					{@html parseMarkdown(cssVar.description)}
				</div>
			</ScrollArea>
		</div>
	</PopoverContent>
	<span aria-hidden="true" class="hidden">
		<!-- - {type.stringDefinition} -->
	</span>
</Popover.Root>
