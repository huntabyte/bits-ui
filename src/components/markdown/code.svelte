<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<code
	class={cn(
		"relative inline-flex justify-center items-center rounded-button px-[8px] font-mono text-sm bg-muted h-[27px] tracking-tighter text-foreground/60 font-medium",
		className,
		"custom"
	)}
>
	<slot />
</code>
