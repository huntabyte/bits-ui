<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { PaginationPageProps } from "../types.js";
	import { usePaginationPage } from "../pagination.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		id = useId(),
		page,
		child,
		children,
		type = "button",
		ref = $bindable(null),
		...restProps
	}: PaginationPageProps = $props();

	const pageState = usePaginationPage({
		id: box.with(() => id),
		page: box.with(() => page),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, pageState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{#if children}
			{@render children?.()}
		{:else}
			{page.value}
		{/if}
	</button>
{/if}
