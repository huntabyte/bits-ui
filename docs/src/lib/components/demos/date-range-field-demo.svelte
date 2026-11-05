<script lang="ts">
	import { DateRangeField } from "bits-ui";
</script>

<DateRangeField.Root class="group flex w-full max-w-[320px] flex-col gap-1.5">
	<DateRangeField.Label class="block text-sm font-medium select-none">
		Hotel dates
	</DateRangeField.Label>
	<div
		class="flex h-input w-full items-center rounded-input border border-border-input bg-background px-2 py-3 text-sm tracking-[0.01em] text-foreground select-none group-data-invalid:border-destructive focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
	>
		{#each ["start", "end"] as const as type (type)}
			<DateRangeField.Input {type}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (part + i)}
						<div class="inline-block select-none">
							{#if part === "literal"}
								<DateRangeField.Segment {part} class="p-1 text-muted-foreground">
									{value}
								</DateRangeField.Segment>
							{:else}
								<DateRangeField.Segment
									{part}
									class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:ring-0! focus-visible:ring-offset-0! aria-[valuetext=Empty]:text-muted-foreground"
								>
									{value}
								</DateRangeField.Segment>
							{/if}
						</div>
					{/each}
				{/snippet}
			</DateRangeField.Input>
			{#if type === "start"}
				<div aria-hidden="true" class="px-1 text-muted-foreground">–⁠⁠⁠⁠⁠</div>
			{/if}
		{/each}
	</div>
</DateRangeField.Root>
