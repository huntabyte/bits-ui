<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { PaginationNextButtonProps } from "../types.js";
	import { PaginationButtonState } from "../pagination.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		child,
		children,
		ref = $bindable(null),
		type = "button",
		disabled = false,
		...restProps
	}: PaginationNextButtonProps = $props();

	const nextButtonState = PaginationButtonState.create({
		type: "next",
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, nextButtonState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
