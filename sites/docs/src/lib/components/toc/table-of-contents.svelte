<script lang="ts">
	import { createTableOfContents } from "@melt-ui/svelte";
	import Tree from "./tree.svelte";

	let { selector = "#content" }: { selector?: string } = $props();

	const {
		elements: { item },
		states: { headingsTree, activeHeadingIdxs },
		helpers: { isActive },
	} = createTableOfContents({
		selector,
		exclude: ["h1", "h4", "h5", "h6"],
		activeType: "all",
		scrollOffset: 80,
	});
</script>

<div class="mt-1 h-[calc(100vh-116px)] overflow-y-auto rounded-lg p-4">
	<nav class="">
		{#key $headingsTree}
			<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} {item} {isActive} />
		{/key}
	</nav>
</div>
