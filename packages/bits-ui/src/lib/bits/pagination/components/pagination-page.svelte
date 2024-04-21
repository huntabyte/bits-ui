<script lang="ts">
	import type { PageProps } from "../index.js";
	import { setPaginationPageState } from "../pagination.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { generateId } from "$lib/internal/id.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		id = generateId(),
		page,
		asChild,
		child,
		children,
		type = "button",
		el = $bindable(),
		onclick = noop,
		onkeydown = noop,
		style = {},
		...restProps
	}: PageProps = $props();

	const state = setPaginationPageState({
		id: readonlyBox(() => id),
		page: readonlyBox(() => page),
		onclick: readonlyBox(() => onclick),
		onkeydown: readonlyBox(() => onkeydown),
	});

	const mergedProps = $derived({
		...restProps,
		...state.props,
		type,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{#if children}
			{@render children?.()}
		{:else}
			{page}
		{/if}
	</button>
{/if}
