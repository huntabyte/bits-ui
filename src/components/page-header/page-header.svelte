<script lang="ts">
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<section class={cn("relative pt-[72px]", className)}>
	<slot />
</section>
