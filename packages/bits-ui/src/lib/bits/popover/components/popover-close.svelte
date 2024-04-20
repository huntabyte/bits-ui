<script lang="ts">
	import type { CloseProps } from "../index.js";
	import { setPopoverCloseState } from "../popover.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		onclick = noop,
		onkeydown = noop,
		style = {},
		...restProps
	}: CloseProps = $props();

	const state = setPopoverCloseState({
		onclick: readonlyBox(() => onclick),
		onkeydown: readonlyBox(() => onkeydown),
	});

	const mergedProps = $derived({
		...restProps,
		...state.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={el}>
		{@render children?.()}
	</button>
{/if}
