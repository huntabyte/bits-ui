<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import { setPopoverTriggerState } from "../popover.svelte.js";
	import { generateId, noop, readonlyBox, styleToString } from "$lib/internal/index.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		asChild,
		children,
		child,
		id = generateId(),
		el = $bindable(),
		onclick = noop,
		onkeydown = noop,
		style = {},
		...restProps
	}: TriggerProps = $props();

	const popoverTriggerState = setPopoverTriggerState({
		id: readonlyBox(() => id),
		onclick: readonlyBox(() => onclick),
		onkeydown: readonlyBox(() => onkeydown),
	});

	const mergedProps = $derived({
		...restProps,
		...popoverTriggerState.props,
		style: styleToString(style),
	});
</script>

<FloatingLayer.Anchor {id}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<button {...mergedProps} bind:this={el}>
			{@render children?.()}
		</button>
	{/if}
</FloatingLayer.Anchor>
