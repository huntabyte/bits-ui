<script lang="ts">
	import { flatNavigation } from "$lib/config/navigation.js";
	import { page } from "$app/state";
	import { cn } from "$lib/utils/styles.js";
	import { Separator } from "bits-ui";

	const previous = $derived(
		flatNavigation[flatNavigation.findIndex((item) => item.href === page.url.pathname) - 1]
	);
	const next = $derived(
		flatNavigation[flatNavigation.findIndex((item) => item.href === page.url.pathname) + 1]
	);
</script>

<Separator.Root class="bg-border my-6 h-px" />
<div class="flex flex-col gap-4 pt-1">
	<div class="grid grid-cols-2 gap-4">
		{#if previous}
			<a
				href={previous.href}
				class={cn(
					"hover:bg-muted/50 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden group flex flex-col gap-2 rounded-[7px] border p-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
				)}
			>
				<span class="text-muted-foreground flex items-center gap-1 text-xs font-medium">
					Previous
				</span>
				<span class="text-foreground font-medium">{previous.title}</span>
			</a>
		{/if}
		{#if next}
			<a
				href={next.href}
				class={cn(
					"hover:bg-muted/50 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden group col-start-2 flex flex-col gap-2 rounded-[7px] border p-4 text-right transition-colors focus-visible:ring-2 focus-visible:ring-offset-2"
				)}
			>
				<span
					class="text-muted-foreground flex items-center justify-end gap-1 text-xs font-medium"
				>
					Next
				</span>
				<span class="text-foreground font-medium">{next.title}</span>
			</a>
		{/if}
	</div>
</div>
