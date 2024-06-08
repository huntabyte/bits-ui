<script lang="ts">
	import type { SelectContentImplProps } from "../types.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		id = useId(),
		position = "item-aligned",
		align = "start",
		...restProps
	}: SelectContentImplProps = $props();
</script>
