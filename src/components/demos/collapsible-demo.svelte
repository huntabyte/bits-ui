<script lang="ts">
	import { Collapsible } from "$lib";
	import { CaretUpDown } from "phosphor-svelte";
	import { slide } from "svelte/transition";
</script>

<Collapsible.Root class="w-[327px] space-y-3">
	<div class="flex items-center justify-between space-x-10">
		<h4 class="text-[15px] font-medium">@huntabyte starred 3 repositories</h4>
		<Collapsible.Trigger
			class="inline-flex h-10 w-10 items-center justify-center rounded-[9px] border border-border-input shadow-btn transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98"
		>
			<CaretUpDown class="h-4 w-4 text-foreground" weight="bold" />
			<span class="sr-only">Toggle</span>
		</Collapsible.Trigger>
	</div>

	<Collapsible.Content class="space-y-2" transition={slide}>
		<div
			class="inline-flex h-12 w-full items-center rounded-[9px] bg-muted px-[18px] py-3 font-mono text-[15px] tracking-[0.01em]"
		>
			@huntabyte/bits-ui
		</div>
		<div
			class="inline-flex h-12 w-full items-center rounded-[9px] bg-muted px-[18px] py-3 font-mono text-[15px] tracking-[0.01em]"
		>
			@huntabyte/shadcn-svelte
		</div>
		<div
			class="inline-flex h-12 w-full items-center rounded-[9px] bg-muted px-[18px] py-3 font-mono text-[15px] tracking-[0.01em]"
		>
			@melt-ui/meltui
		</div>
	</Collapsible.Content>
</Collapsible.Root>
