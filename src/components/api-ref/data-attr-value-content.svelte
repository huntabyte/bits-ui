<script lang="ts">
	import { Popover } from "$lib";
	import { flyAndScale } from "@/utils";
	import { Code } from "@/components";
	import { Info } from "phosphor-svelte";
	import type { DataAttrSchema } from "@/types";

	export let attr: DataAttrSchema;
</script>

<div class="flex items-center gap-1.5">
	{#if !attr.isEnum}
		<Code class="bg-transparent px-0">{attr.value ?? "——"}</Code>
	{:else}
		<Code class="bg-transparent px-0">enum</Code>
		<Popover.Root>
			<Popover.Trigger
				class="inline-flex items-center justify-center rounded-button text-foreground-alt transition-colors hover:text-foreground-alt/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				<Info class="sq-4" weight="bold" />
				<span class="sr-only">See possible values</span>
			</Popover.Trigger>
			<Popover.Content
				side="top"
				sideOffset={10}
				transition={flyAndScale}
				transitionConfig={{ y: 8 }}
				class="z-50 max-h-[400px] overflow-auto rounded-input border border-border bg-background p-4 shadow-popover"
			>
				<Code class="h-auto bg-transparent px-0 tracking-tight text-foreground">
					{attr.value}
				</Code>
			</Popover.Content>
		</Popover.Root>
	{/if}
</div>
