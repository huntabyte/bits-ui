<script lang="ts">
	import { cn } from "@/utils";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<div class={cn("animate-pulse rounded-md bg-primary/10", className)} {...$$restProps} />
