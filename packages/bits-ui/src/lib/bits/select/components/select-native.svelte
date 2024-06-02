<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLSelectAttributes } from "svelte/elements";
	import { VisuallyHidden } from "$lib/bits/utilities/visually-hidden/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	type Props = {
		autocomplete?: string;
		autofocus?: boolean;
		disabled?: boolean;
		form?: string;
		multiple?: boolean;
		name?: string;
		required?: boolean;
		size?: number;
		value?: any;
		children?: Snippet;
	} & HTMLSelectAttributes;

	let { value = $bindable(""), children, ...restProps }: Props = $props();

	/**
	 * A native `select` supports autofill, validation, and other browser features.
	 *
	 * We use `VisuallyHidden` rather than `display: "none"` because Safari won't autofill
	 * if the input isn't visible.
	 */
</script>

<VisuallyHidden asChild>
	{#snippet child({ props })}
		{@const mergedProps = mergeProps(props, restProps)}
		<select bind:value {...mergedProps}>
			{@render children?.()}
		</select>
	{/snippet}
</VisuallyHidden>
