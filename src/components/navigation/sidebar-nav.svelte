<script lang="ts">
	import type { SidebarNavItem } from "@/config";
	import { SidebarNavItems, SidebarNavMainItems } from "@/components";
	export let items: SidebarNavItem[] = [];
</script>

{#if items.length}
	<aside
		class="fixed top-10 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-border md:sticky md:block"
	>
		<div class="h-full py-6 pr-4 lg:py-8">
			<nav class="space-y-3">
				<div class="flex w-full flex-col pb-[50px]">
					{#each items as item, index (index)}
						{#if item.title === "Overview"}
							<SidebarNavMainItems items={item.items} />
						{:else}
							<div class="pb-4">
								<h4
									class="mb-1 ml-[9px] rounded-md px-2.5 py-2 pl-4 text-xs font-normal uppercase text-muted-foreground"
								>
									{item.title}
								</h4>
								{#if item.items}
									<SidebarNavItems items={item.items} />
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</nav>
		</div>
	</aside>
{/if}
