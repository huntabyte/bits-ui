<script lang="ts">
	import { Collapsible } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
</script>

<Collapsible.Root class="w-[327px] space-y-3">
	<div class="flex items-center justify-between space-x-10">
		<h4 class="text-[15px] font-medium">@huntabyte starred 3 repositories</h4>
		<Collapsible.Trigger
			class="inline-flex h-10 w-10 items-center justify-center rounded-9px border border-border-input bg-background-alt text-foreground shadow-btn transition-all hover:bg-muted active:scale-[0.98]"
			aria-label="Show starred repositories"
		>
			<CaretUpDown class="size-4" weight="bold" />
		</Collapsible.Trigger>
	</div>

	<Collapsible.Content
		hiddenUntilFound
		class="space-y-2 overflow-hidden font-mono text-[15px] tracking-[0.01em] data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
	>
		<div class="inline-flex h-12 w-full items-center rounded-9px bg-muted px-[18px] py-3">
			@huntabyte/bits-ui
		</div>
		<div class="inline-flex h-12 w-full items-center rounded-9px bg-muted px-[18px] py-3">
			@huntabyte/shadcn-svelte
		</div>
		<div class="inline-flex h-12 w-full items-center rounded-9px bg-muted px-[18px] py-3">
			@svecosystem/runed
		</div>
	</Collapsible.Content>
</Collapsible.Root>
