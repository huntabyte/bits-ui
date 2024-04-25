<script lang="ts">
	import { useFloatingAnchorState } from "../useFloatingLayer.svelte.js";
	import type { AnchorProps } from "./index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let { id, children }: AnchorProps = $props();

	useFloatingAnchorState({ id: readonlyBox(() => id) });
</script>

{@render children?.()}
