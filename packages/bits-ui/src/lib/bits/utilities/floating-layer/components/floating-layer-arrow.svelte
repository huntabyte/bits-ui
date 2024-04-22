<script lang="ts">
	import { setFloatingArrowState } from "../floating-layer.svelte.js";
	import { Arrow, type ArrowProps } from "$lib/bits/utilities/arrow/index.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";

	let { id = useId(), el = $bindable(), ...restProps }: ArrowProps = $props();

	const state = setFloatingArrowState({
		id: readonlyBox(() => id),
	});

	// explicit any here because the `asChild` and `child` are causing this to never out
	const mergedProps = $derived<any>(mergeProps(restProps, state.props));
</script>

<Arrow {...mergedProps} bind:el />
