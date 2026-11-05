<script lang="ts">
	import { cn } from "#lib/utils/styles.js";
	import type { TableOfContents } from "#lib/utils/use-toc.svelte.js";
	import Tree from "./toc-tree.svelte";

	let {
		tree,
		level = 1,
		activeUrl,
	}: {
		tree: TableOfContents;
		level?: number;
		activeUrl: string | null;
	} = $props();
</script>

{#if tree?.items?.length && level < 3}
	<ul
		class={cn("m-0 list-none", {
			"pl-4": level !== 1,
			"border-l border-border/50": level === 1,
		})}
	>
		{#each tree.items as item, index (index)}
			{@const isActive = activeUrl === item.url}
			<li class={cn("mt-0")}>
				<a
					aria-current={isActive ? "location" : undefined}
					href={item.url}
					class={cn(
						"inline-block border-l border-l-transparent py-[5px] pl-5 leading-4 no-underline hover:text-foreground",
						isActive
							? "border-l-foreground text-foreground"
							: "border-l-transparent text-muted-foreground",
						level !== 1 && "-ml-4 pl-10"
					)}
				>
					{item.title}
				</a>
				{#if item.items?.length}
					<Tree tree={item} level={level + 1} {activeUrl} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}
