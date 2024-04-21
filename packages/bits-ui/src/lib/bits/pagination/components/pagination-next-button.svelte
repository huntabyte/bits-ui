<script lang="ts">
	import type { NextButtonProps } from "../index.js";
	import { setPaginationButtonState } from "../pagination.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { generateId } from "$lib/internal/id.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		id = generateId(),
		asChild,
		child,
		children,
		el = $bindable(),
		onclick = noop,
		onkeydown = noop,
		style = {},
		type = "button",
		...restProps
	}: NextButtonProps = $props();

	const state = setPaginationButtonState({
		type: "next",
		id: readonlyBox(() => id),
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
		{@render children?.()}
	</button>
{/if}
