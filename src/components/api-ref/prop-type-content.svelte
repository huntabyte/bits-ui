<script lang="ts">
	import { Popover } from "$lib";
	import { cn, flyAndScale, parseTypeDef } from "@/utils";
	import { Code } from "@/components";
	import { Info } from "phosphor-svelte";
	import type { PropType } from "@/types";

	export let type: PropType | string;
	$: console.log(type);
</script>

<div class="flex items-center gap-1.5">
	{#if typeof type === "string"}
		<Code class="bg-transparent px-0">{type}</Code>
	{:else}
		<Code class="bg-transparent px-0">{type.type}</Code>
		<Popover.Root positioning={{ placement: "top", gutter: 8 }}>
			<Popover.Trigger
				class="rounded-button inline-flex items-center justify-center text-foreground-alt hover:text-foreground-alt/80 transition-colors"
			>
				<Info class="sq-4" weight="bold" />
				<span class="sr-only">See type definition</span>
			</Popover.Trigger>
			<Popover.Content
				transition={flyAndScale}
				transitionConfig={{ y: 8 }}
				class="z-50 bg-background rounded-input p-4 shadow-popover border border-border"
			>
				<Code class="bg-transparent px-0 text-foreground tracking-tight h-auto">
					{@html parseTypeDef(type.definition)}
				</Code>
			</Popover.Content>
		</Popover.Root>
	{/if}
</div>
