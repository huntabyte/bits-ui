<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	type $$Props = HTMLAttributes<HTMLTableRowElement> & {
		"data-state"?: unknown;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<tr class={cn("border-b", className)} {...$$restProps}>
	<slot />
</tr>
