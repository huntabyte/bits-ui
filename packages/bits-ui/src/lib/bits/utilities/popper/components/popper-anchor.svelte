<script lang="ts">
	import type { AnchorProps } from "../index.js";
	import { setPopperAnchorState } from "../popper.svelte.js";

	let { node, children }: AnchorProps = $props();

	setPopperAnchorState({ node });
</script>

{@render children?.()}
