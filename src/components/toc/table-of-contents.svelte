<script lang="ts">
	import { createTableOfContents } from "@melt-ui/svelte";
	import Tree from "./tree.svelte";

	export let selector = "#content";

	const {
		elements: { item },
		states: { headingsTree, activeHeadingIdxs },
		helpers: { isActive }
	} = createTableOfContents({
		selector,
		exclude: ["h1", "h4", "h5", "h6"],
		activeType: "all",
		scrollOffset: 80
	});
</script>

<div class="mt-1 overflow-y-auto rounded-lg p-4">
	<nav>
		{#key $headingsTree}
			<Tree
				tree={$headingsTree}
				activeHeadingIdxs={$activeHeadingIdxs}
				{item}
				{isActive}
			/>
		{/key}
	</nav>
</div>
