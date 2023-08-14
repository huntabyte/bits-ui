<script lang="ts">
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLTableSectionElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<tfoot class={cn("bg-primary font-medium text-primary-foreground", className)} {...$$restProps}>
	<slot />
</tfoot>
