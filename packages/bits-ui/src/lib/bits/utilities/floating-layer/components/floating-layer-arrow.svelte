<script lang="ts">
	import { setFloatingArrowState } from "../floating-layer.svelte.js";
	import { Arrow, type ArrowProps } from "$lib/bits/utilities/arrow/index.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";

	let { id = generateId(), el = $bindable(), style = {}, ...restProps }: ArrowProps = $props();

	const state = setFloatingArrowState({
		id: readonlyBox(() => id),
		style: readonlyBox(() => style),
	});

	const mergedProps = $derived({
		...restProps,
		...state.props,
	});
</script>

<Arrow {...mergedProps} bind:el />
