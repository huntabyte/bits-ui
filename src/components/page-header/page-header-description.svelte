<script lang="ts">
	import { cn } from "@/utils";
	import Balancer from "svelte-wrap-balancer";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn("text-xl font-semibold text-foreground/40 mt-4 tracking-tight", className)}>
	<Balancer>
		<slot />
	</Balancer>
</p>
