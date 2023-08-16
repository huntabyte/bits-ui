<script lang="ts">
	import Balancer from "svelte-wrap-balancer";
	import { cn } from "@/utils";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn("capitalize font-medium mb-4 text-sm/6 text-accent-foreground", className)}>
	<Balancer>
		<slot />
	</Balancer>
</p>
