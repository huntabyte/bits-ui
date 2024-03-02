<script lang="ts">
	import { cn } from "@/utils/index.js";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p
	class={cn(
		"mt-3 mb-11 text-balance text-[21px] font-semibold tracking-[-0.01em] text-foreground/40 leading-7",
		className
	)}
>
	<slot />
</p>
