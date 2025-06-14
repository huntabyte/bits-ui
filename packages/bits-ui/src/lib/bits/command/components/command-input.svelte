<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CommandInputProps } from "../types.js";
	import { CommandInputState } from "../command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		value = $bindable(""),
		autofocus = false,
		id = createId(uid),
		ref = $bindable(null),
		child,
		...restProps
	}: CommandInputProps = $props();

	const inputState = CommandInputState.create({
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

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<input {...mergedProps} bind:value />
{/if}
