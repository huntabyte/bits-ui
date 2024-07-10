<script lang="ts">
	import { cn } from "$lib/utils/index.js";
	import type { Snippet } from "svelte";
	type Props = {
		align?: "start" | "center" | "end";
		children: Snippet;
	};

	let { align = "center", children }: Props = $props();
</script>

<div
	class="relative rounded-tl-card rounded-tr-card border-2 border-muted bg-zinc-50 !ring-transparent dark:bg-neutral-900/50"
>
	<div
		class={cn("preview flex min-h-[443px] w-full justify-center p-12", {
			"items-center": align === "center",
			"items-start": align === "start",
			"items-end": align === "end",
		})}
	>
		{@render children()}
	</div>
</div>
