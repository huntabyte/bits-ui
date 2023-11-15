<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<section class={cn("relative pb-10", className)}>
	<slot />
</section>
