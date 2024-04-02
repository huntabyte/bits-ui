<script lang="ts">
	import { cn } from "$lib/utils/index.js";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<section class={cn("relative", className)}>
	<slot />
</section>
