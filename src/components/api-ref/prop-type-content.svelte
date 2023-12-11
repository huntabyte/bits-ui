<script lang="ts">
	import { Popover } from "$lib";
	import { flyAndScale, parseTypeDef } from "@/utils";
	import { Code } from "@/components";
	import { Info } from "phosphor-svelte";
	import type { PropType } from "@/types";

	export let type: PropType | string;
</script>

<div class="flex items-center gap-1.5">
	{#if typeof type === "string"}
		<Code class="bg-transparent px-0">{type}</Code>
	{:else}
		<Code class="bg-transparent px-0">{type.type}</Code>
		<Popover.Root>
			<Popover.Trigger
				class="inline-flex items-center justify-center rounded-button text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
			>
				<Info class="sq-4" weight="bold" />
				<span class="sr-only">See type definition</span>
			</Popover.Trigger>
			<Popover.Content
				side="top"
				sideOffset={10}
				transition={flyAndScale}
				transitionConfig={{ y: 8 }}
				class="z-50 max-h-[400px] overflow-auto rounded-input border border-border bg-background p-4 shadow-popover"
			>
				<Code class="h-auto bg-transparent px-0 tracking-tight text-foreground">
					{@html parseTypeDef(type.definition)}
				</Code>
			</Popover.Content>
		</Popover.Root>
	{/if}
</div>
