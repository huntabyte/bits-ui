<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<section class={cn("relative border-b border-border py-8", className)}>
	<slot />
</section>
