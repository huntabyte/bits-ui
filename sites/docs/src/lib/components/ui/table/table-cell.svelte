<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils/index.js";

	type $$Props = HTMLAttributes<HTMLTableCellElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<td
	class={cn(
		"py-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
		className
	)}
	{...$$restProps}
>
	<slot />
</td>
