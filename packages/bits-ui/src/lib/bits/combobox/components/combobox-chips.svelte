<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ComboboxChipsProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { ComboboxChipsState } from "$lib/bits/select/select.svelte.js";

	let {
		id = useId(),
		ref = $bindable(null),
		child,
		children,
		...restProps
	}: ComboboxChipsProps = $props();

	const chipsState = ComboboxChipsState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, chipsState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...chipsState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(chipsState.snippetProps)}
	</div>
{/if}
