<script lang="ts">
	import type { PageProps } from "../index.js";
	import { usePaginationPage } from "../pagination.svelte.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		page,
		asChild,
		child,
		children,
		type = "button",
		el = $bindable(),
		...restProps
	}: PageProps = $props();

	const state = usePaginationPage({
		id: readonlyBox(() => id),
		page: readonlyBox(() => page),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{#if children}
			{@render children?.()}
		{:else}
			{page.value}
		{/if}
	</button>
{/if}
