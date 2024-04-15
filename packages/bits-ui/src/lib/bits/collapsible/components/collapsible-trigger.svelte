<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import { getCollapsibleTriggerState } from "../collapsible.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		onclick: onclickProp = () => {},
		style = {},
		...restProps
	}: TriggerProps = $props();

	const onclick = readonlyBox(() => onclickProp);

	const triggerState = getCollapsibleTriggerState({ onclick });

	const mergedProps = $derived({
		...triggerState.props,
		...restProps,
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
