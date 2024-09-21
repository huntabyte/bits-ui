<script lang="ts">
	import { mergeProps, useId } from "bits-ui";
	import { box } from "svelte-toolbelt";
	import type { InputProps } from "../index.js";
	import { useCommandInput } from "../command.svelte.js";

	let {
		value = $bindable(""),
		autofocus = false,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: InputProps = $props();

	const inputState = useCommandInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				value = v;
			}
		),
		autofocus: box.with(() => autofocus ?? false),
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

<input {...mergedProps} bind:value />
