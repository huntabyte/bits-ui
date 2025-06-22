<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PaginationPageProps } from "../types.js";
	import { PaginationPageState } from "../pagination.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		page,
		child,
		children,
		type = "button",
		ref = $bindable(null),
		disabled = false,
		...restProps
	}: PaginationPageProps = $props();

	const pageState = PaginationPageState.create({
		id: box.with(() => id),
		page: box.with(() => page),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => Boolean(disabled)),
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
