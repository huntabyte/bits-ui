<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<code
	class={cn(
		"relative inline-flex justify-center items-center !rounded-button !px-[10px] font-mono !text-sm !bg-muted h-[29px] tracking-tight text-foreground/60 !font-medium",
		className
	)}
>
	<slot />
</code>
