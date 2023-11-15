<script lang="ts">
	import {
		type TableOfContentsItem,
		type TableOfContentsElements,
		type TableOfContents,
		melt
	} from "@melt-ui/svelte";

	export let tree: TableOfContentsItem[] = [];
	export let activeHeadingIdxs: number[];
	export let item: TableOfContentsElements["item"];
	export let level = 1;
	export let isActive: TableOfContents["helpers"]["isActive"];
</script>

<ul class="m-0 list-none">
	{#if tree && tree.length}
		{#each tree as heading, i (i)}
			{@const node = heading.node.innerHTML}
			{@const nodeWithoutSpan = node.replace(/<span.*<\/span>/g, "")}
			<li class="mt-0 {level === 1 && 'border-l'}">
				<a
					href="#{heading.id}"
					use:melt={$item(heading.id)}
					class="inline-flex items-center justify-center gap-1 text-muted-foreground no-underline transition-colors
				hover:text-foreground data-[active]:text-foreground data-[active]:border-l-foreground border-l border-l-transparent pl-4 pb-2 {level !==
						1 && 'pl-8'} -mx-[1px] transition-all duration-200"
				>
					{@html nodeWithoutSpan}
				</a>

				{#if heading.children && heading.children.length}
					<svelte:self
						tree={heading.children}
						level={level + 1}
						{activeHeadingIdxs}
						{isActive}
						{item}
					/>
				{/if}
			</li>
		{/each}
	{/if}
</ul>
