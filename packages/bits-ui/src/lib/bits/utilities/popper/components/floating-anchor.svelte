<script lang="ts">
	import type { AnchorProps } from "../index.js";
	import { setFloatingAnchorState } from "../floating.svelte.js";

	let { node, children }: AnchorProps = $props();

	setFloatingAnchorState({ node });
</script>

{@render children?.()}
