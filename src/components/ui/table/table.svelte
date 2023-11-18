<script lang="ts">
	import { cn } from "@/utils";
	import type { HTMLTableAttributes } from "svelte/elements";

	type $$Props = HTMLTableAttributes;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class="w-full overflow-auto rounded-md">
	<table
		class={cn("w-full caption-bottom text-sm", className)}
		{...$$restProps}
	>
		<slot />
	</table>
</div>
