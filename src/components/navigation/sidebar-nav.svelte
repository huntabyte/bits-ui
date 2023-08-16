<script lang="ts">
	import type { SidebarNavItem } from "@/config";
	import { SidebarNavItems } from "@/components";
	export let items: SidebarNavItem[] = [];
</script>

{#if items.length}
	<aside
		class="hidden overflow-y-auto lg:block lg:max-h-[calc(100vh-64px)] lg:sticky lg:top-16 py-8 lg:px-4 lg:-mx-4"
	>
		<div class="relative">
			<nav class="space-y-3">
				<div class="flex flex-col w-full">
					{#each items as item, index (index)}
						<div class="pb-4">
							<h4 class="mb-1 rounded-md px-1 py-1 text-sm font-semibold">
								{item.title}
							</h4>
							{#if item.items}
								<SidebarNavItems items={item.items} />
							{/if}
						</div>
					{/each}
				</div>
			</nav>
		</div>
	</aside>
{/if}
