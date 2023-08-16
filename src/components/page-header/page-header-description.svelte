<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn("text-lg text-muted-foreground mt-4", className)}>
	<slot />
</p>
