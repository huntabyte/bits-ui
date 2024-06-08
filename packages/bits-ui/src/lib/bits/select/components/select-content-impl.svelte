<!-- <script lang="ts">
	import type { SelectContentImplProps } from "../types.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { useSelectContentImpl } from "../select.svelte.js";
	import { box } from "svelte-toolbelt";

	let {
		id = useId(),
		position = "item-aligned",
		align = "start",
		...restProps
	}: SelectContentImplProps = $props();

	const state = useSelectContentImpl({
		id: box.with(() => id),
		position: box.with(() => position)
	})


</script> -->
