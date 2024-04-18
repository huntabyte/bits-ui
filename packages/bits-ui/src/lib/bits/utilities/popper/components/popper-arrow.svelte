<script lang="ts">
	import type { ArrowProps } from "../index.js";
	import { setPopperArrowState } from "../popper.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let { id, children }: ArrowProps = $props();

	setPopperArrowState({ id: readonlyBox(() => id) });
</script>

{@render children?.()}
