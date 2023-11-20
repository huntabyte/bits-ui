<script lang="ts">
	import { cn } from "@/utils";
	import Balancer from "svelte-wrap-balancer";
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p
	class={cn(
		"mt-3 text-[21px] font-semibold tracking-[-0.01em] text-foreground/40",
		className
	)}
>
	<Balancer>
		<slot />
	</Balancer>
</p>
