<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h1 class={cn("scroll-m-20 text-4xl font-semibold tracking-tight", className)}>
	<slot />
</h1>
