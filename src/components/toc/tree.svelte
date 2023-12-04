<script lang="ts">
	import { cn } from "@/utils";
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

	function hoverAction(node: HTMLElement) {
		function handleMouseEnter() {
			node.parentElement?.setAttribute("data-hover", "");
		}

		function handleMouseLeave() {
			node.parentElement?.removeAttribute("data-hover");
		}

		node.addEventListener("mouseenter", handleMouseEnter);
		node.addEventListener("mouseleave", handleMouseLeave);

		return {
			destroy() {
				node.removeEventListener("mouseenter", handleMouseEnter);
				node.removeEventListener("mouseleave", handleMouseLeave);
			}
		};
	}
</script>

<ul class="m-0 list-none">
	{#if tree && tree.length}
		{#each tree as heading, i (i)}
			{@const node = heading.node.innerHTML}
			{@const nodeWithoutSpan = node.replace(/<span.*<\/span>/g, "")}
			<li class="mt-0 {level === 1 && 'border-l'}">
				<div
					class={cn(
						"-mx-[1px] inline-flex items-center justify-center gap-1 border-l border-l-transparent pb-2 pl-4 text-muted-foreground no-underline transition-colors data-[hover]:border-l-foreground",
						level !== 1 ? "pl-8" : "",
						$isActive(heading.id) && "border-l-foreground"
					)}
				>
					<a
						href="#{heading.id}"
						use:melt={$item(heading.id)}
						use:hoverAction
						class="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[active]:text-foreground"
					>
						{@html nodeWithoutSpan}
					</a>
				</div>

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
