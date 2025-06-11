<script lang="ts">
	import { Popover } from "bits-ui";
	import Info from "phosphor-svelte/lib/Info";
	import Code from "$lib/components/markdown/code.svelte";
	import PropTypeContent from "./prop-type-content.svelte";
	import type { PropType } from "$lib/types/index.js";
	import { parseMarkdown } from "$lib/utils/index.js";
	import MobileTypeContent from "./mobile-type-content.svelte";

	let {
		type,
		description,
		defaultValue,
		href = "",
		tooltipContent = "",
		slotted = false,
	}: {
		type: PropType | string;
		description: string;
		defaultValue?: string;
		href?: string;
		tooltipContent?: string;
		slotted?: boolean;
	} = $props();
</script>

<Popover.Root>
	<Popover.Trigger
		class="rounded-button text-muted-foreground hover:text-foreground focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
	>
		<Info class="size-4" weight="bold" />
		<span class="sr-only">View property details</span>
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			side="top"
			align="end"
			sideOffset={8}
			class="rounded-input border-border bg-background shadow-popover outline-hidden z-50 max-w-[90vw] border p-4"
		>
			<div class="flex flex-col gap-3">
				<div>
					<h4 class="text-muted-foreground mb-1 text-sm font-medium">Type</h4>
					<MobileTypeContent {type} />
					<PropTypeContent {type} disablePopover={true} />
				</div>

				<div>
					<h4 class="text-muted-foreground mb-1 text-sm font-medium">Description</h4>
					<div class="text-sm leading-relaxed">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html parseMarkdown(description)}
					</div>
				</div>

				{#if !slotted && defaultValue !== undefined}
					<div>
						<h4 class="text-muted-foreground mb-1 text-sm font-medium">Default</h4>
						<Code class="bg-background px-2 py-1 text-xs">
							{#if defaultValue}
								{defaultValue}
							{:else}
								<span aria-hidden="true">——</span>
								<span class="sr-only">undefined</span>
							{/if}
						</Code>
					</div>
				{/if}
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
