<script lang="ts">
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import type { PrimitiveElementAttributes } from "$lib/shared/attributes.js";
	import type { WithChildren } from "$lib/internal/types.js";

	let { children, ...restProps }: WithChildren<PrimitiveElementAttributes> = $props();

	const mergedProps = $derived(mergeProps(restProps));
</script>

<div {...mergedProps}>
	{@render children?.()}
</div>
