<script lang="ts">
	import { box } from "runed";
	import { useFloatingAnchorState } from "../useFloatingLayer.svelte.js";
	import type { AnchorProps } from "./index.js";

	let { id, children, virtualEl }: AnchorProps = $props();

	useFloatingAnchorState({ id: box.with(() => id), virtualEl: box.with(() => virtualEl) });
</script>

{@render children?.()}
