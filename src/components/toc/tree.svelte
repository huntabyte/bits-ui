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
			node.parentElement?.classList.add("border-l-foreground");
		}

		function handleMouseLeave() {
			if (node.hasAttribute("data-active")) {
				return;
			}
			node.parentElement?.classList.remove("border-l-foreground");
			node.parentElement?.classList.add("border-l-transparent");
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
						"group -mx-[1px] inline-flex items-center justify-center gap-1 border-l pb-2 pl-4 text-muted-foreground no-underline",
						level !== 1 ? "pl-8" : "",
						$isActive(heading.id)
							? "border-l-foreground"
							: "border-l-transparent"
					)}
				>
					<a
						href="#{heading.id}"
						use:melt={$item(heading.id)}
						class="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[active]:text-foreground"
						use:hoverAction
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
