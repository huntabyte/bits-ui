<script lang="ts">
	import { TimeRangeField } from "bits-ui";
</script>

<TimeRangeField.Root class="group flex w-full max-w-[320px] flex-col gap-1.5">
	<TimeRangeField.Label class="block text-sm font-medium select-none">
		Hotel dates
	</TimeRangeField.Label>
	<div
		class="flex h-input w-full items-center rounded-input border border-border-input bg-background px-2 py-3 text-sm tracking-[0.01em] text-foreground select-none group-data-invalid:border-destructive focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
	>
		{#each ["start", "end"] as const as type (type)}
			<TimeRangeField.Input {type}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (part + i)}
						<div class="inline-block select-none">
							{#if part === "literal"}
								<TimeRangeField.Segment {part} class="p-1 text-muted-foreground">
									{value}
								</TimeRangeField.Segment>
							{:else}
								<TimeRangeField.Segment
									{part}
									class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:ring-0! focus-visible:ring-offset-0! aria-[valuetext=Empty]:text-muted-foreground"
								>
									{value}
								</TimeRangeField.Segment>
							{/if}
						</div>
					{/each}
				{/snippet}
			</TimeRangeField.Input>
			{#if type === "start"}
				<div aria-hidden="true" class="pr-2 pl-1 text-muted-foreground">to</div>
			{/if}
		{/each}
	</div>
</TimeRangeField.Root>
