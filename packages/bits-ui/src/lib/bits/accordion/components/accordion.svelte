<script lang="ts">
	import { setAccordionRootState } from "../accordion.svelte.js";
	import type { RootProps } from "../index.js";
	import { Box, box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		disabled = false,
		asChild,
		children,
		child,
		type,
		value: valueProp = $bindable(),
		el = $bindable(),
		id = generateId(),
		style,
		onValueChange,
		...restProps
	}: RootProps = $props();

	valueProp === undefined && (valueProp = type === "single" ? "" : []);

	const rootState = setAccordionRootState({
		type,
		value: box(
			() => valueProp!,
			(v) => {
				valueProp = v;
				onValueChange?.(v as any);
			}
		) as Box<string> | Box<string[]>,
		id: readonlyBox(() => id),
		disabled: readonlyBox(() => disabled),
	});

	const mergedProps = {
		...rootState.props,
		...restProps,
		style: styleToString(style),
	};
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
