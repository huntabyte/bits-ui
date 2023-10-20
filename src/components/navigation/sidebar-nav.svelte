<script lang="ts">
	import type { SidebarNavItem } from "@/config";
	import { SidebarNavItems, SidebarNavMainItems } from "@/components";
	export let items: SidebarNavItem[] = [];
</script>

{#if items.length}
	<aside
		class="hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-64px)] lg:sticky lg:top-[60px] py-10 pr-2"
	>
		<div class="relative">
			<nav class="space-y-3">
				<div class="flex flex-col w-full">
					{#each items as item, index (index)}
						{#if item.title === "Overview"}
							<SidebarNavMainItems items={item.items} />
						{:else}
							<div class="pb-4">
								<h4
									class="mb-1 rounded-md text-foreground/40 py-2 px-2.5 text-sm font-normal uppercase"
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
