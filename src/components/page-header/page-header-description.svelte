<script lang="ts">
	import { cn } from "@/utils/index.js";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p
	class={cn(
		"mb-11 mt-3 text-balance text-[21px] font-semibold leading-7 tracking-[-0.01em] text-foreground/40",
		className
	)}
>
	<slot />
</p>
