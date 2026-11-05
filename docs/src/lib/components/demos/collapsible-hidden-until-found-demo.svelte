<script lang="ts">
	import { Collapsible } from "bits-ui";
	import CaretUpDown from "phosphor-svelte/lib/CaretUpDown";
</script>

<div class="flex w-full max-w-md flex-col gap-4">
	<div
		class="absolute top-4 left-4 flex flex-col gap-2 rounded-xl border border-border bg-background-alt p-4"
	>
		<div class="flex flex-col gap-2 text-sm text-foreground-alt">
			<span>Try searching for "searchable content" on this page</span>
			<code class="w-fit rounded bg-muted px-1 py-0.5 text-xs">(Ctrl+F / Cmd+F)</code>
		</div>
	</div>

	<Collapsible.Root class="flex flex-col gap-3">
		<div class="flex items-center justify-between gap-4">
			<h4 class="text-[15px] font-medium">FAQ: How does search work?</h4>
			<Collapsible.Trigger
				class="inline-flex h-10 w-10 items-center justify-center rounded-9px border border-border-input bg-background-alt text-foreground shadow-btn transition-all hover:bg-muted active:scale-[0.98]"
				aria-label="Toggle FAQ answer"
			>
				<CaretUpDown class="size-4" weight="bold" />
			</Collapsible.Trigger>
		</div>

		<Collapsible.Content
			hiddenUntilFound
			class="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
		>
			<div
				class="rounded-lg border border-border bg-background p-4 text-[14px] leading-relaxed"
			>
				<p class="mb-3">
					This collapsible contains <strong>searchable content</strong> that demonstrates
					the
					<code class="rounded bg-muted px-1 py-0.5 text-xs">hiddenUntilFound</code> feature.
					When you search for text within this collapsed section, the browser will automatically
					expand it to show the matching results.
				</p>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
