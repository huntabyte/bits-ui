<script lang="ts">
	import type { TriggerProps } from "../index.js";
	import { useTabsTrigger } from "../tabs.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.svelte.js";

	let {
		asChild,
		child,
		children,
		disabled = false,
		id = useId(),
		type = "button",
		value,
		el = $bindable(),
		...restProps
	}: TriggerProps = $props();

	const state = useTabsTrigger({
		id: readonlyBox(() => id),
		disabled: readonlyBox(() => disabled),
		value: readonlyBox(() => value),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
