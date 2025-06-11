<script lang="ts">
	import Badge from "$lib/components/ui/badge.svelte";
	import { cn } from "$lib/utils/styles.js";
	import type { ComponentProps } from "svelte";

	let { class: className, ...restProps }: ComponentProps<typeof Badge> = $props();
</script>

<Badge
	class={cn("border-destructive bg-background text-destructive border", className)}
	{...restProps}
>
	required
</Badge>
