<script lang="ts">
	import type { ArrowProps } from "../index.js";
	import { setFloatingArrowState } from "../floating-layer.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let { id, children, style = {} }: ArrowProps = $props();

	setFloatingArrowState({ id: readonlyBox(() => id), style: readonlyBox(() => style) });
</script>

{@render children?.()}
