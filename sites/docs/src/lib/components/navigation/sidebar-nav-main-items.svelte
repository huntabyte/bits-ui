<script lang="ts">
	import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
	import CodeBlock from "phosphor-svelte/lib/CodeBlock";
	import Compass from "phosphor-svelte/lib/Compass";
	import Palette from "phosphor-svelte/lib/Palette";
	import Sticker from "phosphor-svelte/lib/Sticker";
	import Leaf from "phosphor-svelte/lib/Leaf";
	import CableCar from "phosphor-svelte/lib/CableCar";
	import { page } from "$app/stores";
	import type { SidebarNavItem } from "$lib/config/index.js";
	import { cn } from "$lib/utils/index.js";

	let { items = [] }: { items: SidebarNavItem[] } = $props();

	const iconMap = {
		Introduction: Sticker,
		"Getting Started": Compass,
		Delegation: CodeBlock,
		Styling: Palette,
		Dates: CalendarBlank,
		Ref: Leaf,
		Transitions: CableCar,
	} as const;

	const iconMapKeys = Object.keys(iconMap) as (keyof typeof iconMap)[];

	function isIconMapKey(key: string): key is keyof typeof iconMap {
		return iconMapKeys.includes(key as keyof typeof iconMap);
	}
</script>

{#if items.length}
	<div class="grid grid-flow-row auto-rows-max gap-0.5 pb-8 pl-4 text-sm">
		{#each items as item, index (index)}
			{#if item.href}
				<a
					href={item.href}
					class={cn(
						"group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
						$page.url.pathname === item.href
							? "bg-muted"
							: "bg-transparent hover:bg-muted/50"
					)}
					target={item.external ? "_blank" : ""}
					rel={item.external ? "noreferrer" : ""}
				>
					{#if isIconMapKey(item.title)}
						{@const Icon = iconMap[item.title]}
						<Icon size={22} />
					{/if}
					{item.title}
					{#if item.label}
						<span
							class="ml-2 rounded-[4px] bg-[#FCDAFE] px-1.5 py-1 text-xs font-semibold leading-none text-[#2A266B] no-underline group-hover:no-underline"
						>
							{item.label}
						</span>
					{/if}
				</a>
			{/if}
		{/each}
	</div>
{/if}
