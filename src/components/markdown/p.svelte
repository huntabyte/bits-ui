<script lang="ts">
	import { cn } from "@/utils";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p
	class={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
	{...$$restProps}
>
	<slot />
</p>
