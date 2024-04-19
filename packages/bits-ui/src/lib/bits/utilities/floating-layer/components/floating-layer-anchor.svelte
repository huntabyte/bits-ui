<script lang="ts">
	import type { AnchorProps } from "../index.js";
	import { setFloatingAnchorState } from "../floating-layer.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let { id, children }: AnchorProps = $props();

	setFloatingAnchorState({ id: readonlyBox(() => id) });
</script>

{@render children?.()}
