<script lang="ts">
	import { page } from "$app/state";
	import type { SidebarNavItem } from "#lib/config/index.js";
	import { cn } from "#lib/utils/styles.js";

	let { items = [] }: { items: SidebarNavItem[] } = $props();
</script>

{#if items.length}
	<div class="grid grid-flow-row auto-rows-max gap-0.5 pb-8 pl-4 text-sm">
		{#each items as item, index (index)}
			{#if item.href}
				{@const Icon = item.icon}
				<a
					href={item.href}
					class={cn(
						"group flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden",
						page.url.pathname === item.href
							? "bg-muted"
							: "bg-transparent hover:bg-muted/50"
					)}
					target={item.external ? "_blank" : ""}
					rel={item.external ? "noreferrer" : ""}
				>
					<Icon size={22} />
					{item.title}
					{#if item.label}
						<span
							class="rounded-[4px] bg-[#FCDAFE] px-1.5 py-1 text-xs leading-none font-semibold text-[#2A266B] no-underline group-hover:no-underline"
						>
							{item.label}
						</span>
					{/if}
				</a>
			{/if}
		{/each}
	</div>
{/if}
