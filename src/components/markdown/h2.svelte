<script lang="ts">
	import { cn } from "@/utils";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h2
	class={cn(
		"mt-12 -scroll-m-36 text-[27px] font-semibold tracking-[-0.01em] first:mt-0",
		className
	)}
	{...$$restProps}
>
	<slot />
</h2>
