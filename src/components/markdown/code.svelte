<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<code
	class={cn(
		"relative inline-flex h-[27px] items-center justify-center rounded-button bg-muted px-[8px] font-mono text-sm font-medium tracking-tighter text-foreground/60",
		className,
		"custom"
	)}
>
	<slot />
</code>
