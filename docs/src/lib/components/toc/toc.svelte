<script lang="ts">
	import type { TableOfContents } from "$lib/utils/use-toc.svelte.js";
	import { onMount } from "svelte";
	import TocTree from "./toc-tree.svelte";
	import { ScrollArea } from "bits-ui";
	import List from "phosphor-svelte/lib/List";

	let { toc }: { toc: TableOfContents } = $props();

	let activeUrl = $state<string | null>(null);

	onMount(() => {
		const root = document.getElementById("main-content");
		if (!root) return;
		let elements = root.querySelectorAll("h2, h3");

		let sections: Map<Element, string> = new Map();
		let currentSectionId: string | null = null;
		for (let element of elements) {
			if (element.id && (element.tagName === "H2" || element.tagName === "H3"))
				currentSectionId = element.id;
			if (!currentSectionId) continue;

			sections.set(element, `#${currentSectionId}`);
		}

		let visibleElements = new Set<Element>();

		const callback = (entries: IntersectionObserverEntry[]) => {
			for (let entry of entries) {
				if (entry.isIntersecting) {
					visibleElements.add(entry.target);
				} else {
					visibleElements.delete(entry.target);
				}
			}

			let firstVisibleSection = Array.from(sections.entries()).find(([element]) =>
				visibleElements.has(element)
			);
			if (!firstVisibleSection) return;
			activeUrl = firstVisibleSection[1];
		};

		const observer = new IntersectionObserver(callback, {
			rootMargin: "-70px 0px",
		});

		Array.from(sections.keys()).forEach((element) => observer.observe(element));

		return () => observer.disconnect();
	});
</script>

<ScrollArea.Root>
	<ScrollArea.Viewport class="h-[calc(100vh-300px)]">
		{#if toc?.items?.length}
			<div class="w-[220px] max-w-[220px] space-y-2 text-sm">
				<div class="text-muted-foreground -ml-px flex items-center gap-1.5">
					<List class="size-4 shrink-0" />
					<p class="text-muted-foreground text-sm">On this page</p>
				</div>
				<div class="relative mt-4">
					<TocTree tree={toc} {activeUrl} />
				</div>
			</div>
		{/if}
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar
		orientation="vertical"
		class="hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent bg-transparent p-px transition-all duration-200 hover:w-3"
	>
		<ScrollArea.Thumb class="bg-muted-foreground flex-1 rounded-full" />
	</ScrollArea.Scrollbar>
	<ScrollArea.Corner />
</ScrollArea.Root>
