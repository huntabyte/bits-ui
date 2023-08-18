<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
	export let neutral = false;
</script>

<code
	class={cn(
		"relative rounded !px-[0.25rem] !py-[0.15rem] font-mono !text-[13px]",
		neutral ? "!bg-muted" : "!bg-secondary",
		className
	)}
>
	<slot />
</code>
