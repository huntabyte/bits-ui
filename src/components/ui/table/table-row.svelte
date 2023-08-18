<script lang="ts">
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLTableRowElement> & {
		"data-state"?: any;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<tr class={cn("border-b", className)} {...$$restProps}>
	<slot />
</tr>
