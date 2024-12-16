<script lang="ts">
	import type { Snippet } from "svelte";
	import { box } from "svelte-toolbelt";
	import { useNavigationMenuViewportContentMounter } from "../navigation-menu.svelte.js";

	let { children, child }: { children?: Snippet; child?: Snippet<any> } = $props();

	useNavigationMenuViewportContentMounter({
		children: box.with(() => children),
		child: box.with(() => child),
	});
</script>
