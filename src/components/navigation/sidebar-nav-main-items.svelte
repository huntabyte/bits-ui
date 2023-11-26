<script lang="ts">
	import type { SidebarNavItem } from "@/config";
	import { RocketLaunch, BookOpen, Code, Palette } from "phosphor-svelte";
	import { page } from "$app/stores";
	import { cn } from "@/utils";

	export let items: SidebarNavItem[] = [];

	const iconMap = {
		Introduction: BookOpen,
		"Getting Started": RocketLaunch,
		Delegation: Code,
		Styling: Palette
	} as const;

	const iconMapKeys = Object.keys(iconMap) as (keyof typeof iconMap)[];

	function isIconMapKey(key: string): key is keyof typeof iconMap {
		return iconMapKeys.includes(key as keyof typeof iconMap);
	}
</script>

{#if items.length}
	<div class="grid grid-flow-row auto-rows-max gap-1 pb-8 pl-4 text-sm">
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
						<svelte:component this={iconMap[item.title]} class="sq-5" />
					{/if}
					{item.title}
					{#if item.label}
						<span
							class="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-xs leading-none text-[#000000] no-underline group-hover:no-underline"
						>
							{item.label}
						</span>
					{/if}
				</a>
			{/if}
		{/each}
	</div>
{/if}
