<script lang="ts">
	import type { ArrowProps } from "../index.js";
	import { setFloatingArrowState } from "../floating.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let { id, children }: ArrowProps = $props();

	setFloatingArrowState({ id: readonlyBox(() => id) });
</script>

{@render children?.()}
