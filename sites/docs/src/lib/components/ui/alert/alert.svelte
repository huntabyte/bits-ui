<script lang="ts">
	import type { PrimitiveDivAttributes, WithChildren } from "bits-ui";
	import { type Variant, alertVariants } from "./index.js";
	import { cn } from "$lib/utils/styles.js";

	let {
		variant = "note",
		class: className,
		children,
		...restProps
	}: WithChildren<PrimitiveDivAttributes> & {
		variant?: Variant;
	} = $props();
</script>

<div class={cn(alertVariants({ variant }), className)} {...restProps} role="alert">
	{@render children?.()}
</div>
