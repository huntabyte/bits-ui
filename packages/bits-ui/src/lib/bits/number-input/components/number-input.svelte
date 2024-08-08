<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { NumberInputRootProps } from "../types.js";
	import { useNumberInputRoot } from "../number-input.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(0),
		onValueChange = noop,
		format = true,
		locale = "en-US",
		localeMatcher = "best fit",
		mode = "decimal",
		prefix,
		suffix,
		currency,
		currencyDisplay = "symbol",
		useGrouping = true,
		minFractionDigits = 0,
		maxFractionDigits = 3,
		roundingMode = "halfEven",
		min,
		max,
		step = 1,
		allowEmpty = true,
		highlightOnFocus = true,
		disabled = false,
		readonly = false,
		...restProps
	}: NumberInputRootProps = $props();

	const rootState = useNumberInputRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref as HTMLInputElement,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		format: box.with(() => format),
		locale: box.with(() => locale),
		localeMatcher: box.with(() => localeMatcher),
		mode: box.with(() => mode),
		prefix: box.with(() => prefix),
		suffix: box.with(() => suffix),
		currency: box.with(() => currency),
		currencyDisplay: box.with(() => currencyDisplay),
		useGrouping: box.with(() => useGrouping),
		minFractionDigits: box.with(() => minFractionDigits),
		maxFractionDigits: box.with(() => maxFractionDigits),
		roundingMode: box.with(() => roundingMode),
		min: box.with(() => min),
		max: box.with(() => max),
		step: box.with(() => step),
		allowEmpty: box.with(() => allowEmpty),
		highlightOnFocus: box.with(() => highlightOnFocus),
		disabled: box.with(() => disabled),
		readonly: box.with(() => readonly),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

<input {...mergedProps} />
