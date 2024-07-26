<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ButtonProps } from "../index.js";
	import { useToolbarButton } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		child,
		children,
		disabled = false,
		type = "button",
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: ButtonProps = $props();

	const buttonState = useToolbarButton({
		id: box.with(() => id),
		disabled: box.with(() => disabled ?? false),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, buttonState.props, { type }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
