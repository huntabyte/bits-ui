<script lang="ts">
	import Code from "$lib/components/markdown/code.svelte";
	import { Popover } from "bits-ui";
	import ScrollArea from "$lib/components/scroll-area.svelte";
	import type { PropSchema } from "$lib/types/index.js";
	import Info from "phosphor-svelte/lib/Info";

	let { prop }: { prop: PropSchema } = $props();
</script>

<div class="flex items-center gap-1.5">
	<Code class="bg-transparent px-0">{prop.type.type}</Code>
	{#if prop.type.variant === "complex"}
		<Popover.Root>
			<Popover.Trigger
				data-llm-ignore
				class="rounded-button text-muted-foreground focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				<Info class="size-4" weight="bold" />
				<span class="sr-only">See type definition</span>
			</Popover.Trigger>
			<Popover.Content
				preventScroll={false}
				side="top"
				sideOffset={10}
				class="rounded-card border-border shadow-popover z-50 border-2 bg-zinc-50 py-1.5 pl-1.5 pr-0.5 dark:bg-[#121212]"
			>
				<ScrollArea>
					<div
						class="**:data-line:pr-2.5! [&_pre]:my-0! [&_pre]:mb-0! [&_pre]:overflow-x-visible! [&_pre]:pt-0! [&_pre]:pb-0! [&_pre]:ring-0! [&_pre]:ring-offset-0! [&_pre]:outline-hidden! [&_pre]:mt-0 [&_pre]:border-0 [&_pre]:p-0"
					>
						<prop.type.definition />
					</div>
				</ScrollArea>
			</Popover.Content>
			<span aria-hidden="true" class="hidden">
				- {prop.type.stringDefinition}
			</span>
		</Popover.Root>
	{/if}
</div>
