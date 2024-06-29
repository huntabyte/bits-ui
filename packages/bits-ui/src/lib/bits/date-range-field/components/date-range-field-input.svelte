<script lang="ts">
	import { noop } from "$lib/internal/callbacks.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import { getDateRangeFieldRootContext } from "../date-range-field.svelte.js";
	import type { InputProps } from "../index.js";

	let {
		id = useId(),
		ref = $bindable(null),
		name,
		value = $bindable(),
		onValueChange = noop,
	}: InputProps = $props();

	const rootState = getDateRangeFieldRootContext();
</script>
