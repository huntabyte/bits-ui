<script lang="ts">
	import type { ArrowProps } from "./types.js";
	import { generateId } from "$lib/internal/id.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		id = generateId(),
		el = $bindable(),
		children,
		asChild,
		child,
		style = {},
		height = 5,
		width = 10,
		...restProps
	}: ArrowProps = $props();

	const mergedProps = $derived({
		...restProps,
		style: styleToString(style),
		id,
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<span {...mergedProps} bind:this={el}>
		{#if children}
			{@render children?.()}
		{:else}
			<svg {width} {height} viewBox="0 0 30 10" preserveAspectRatio="none">
				<polygon points="0,0 30,0 15,10" fill="currentColor" />
			</svg>
		{/if}
	</span>
{/if}
