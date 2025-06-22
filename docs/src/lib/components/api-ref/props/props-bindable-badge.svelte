<script lang="ts">
	import Badge from "$lib/components/ui/badge.svelte";
	import { cn } from "$lib/utils/styles.js";
	import type { ComponentProps } from "svelte";

	let { class: className, ...restProps }: ComponentProps<typeof Badge> = $props();
</script>

<Badge
	class={cn(
		"bg-background border border-[#2A266B] text-[#2A266B] dark:border-[#FCDAFE] dark:text-[#FCDAFE]",
		className
	)}
	{...restProps}
>
	$bindable
</Badge>
