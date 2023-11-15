<script lang="ts">
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLTableSectionElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<thead class={cn("[&_tr]:border-b", className)} {...$$restProps}>
	<slot />
</thead>
