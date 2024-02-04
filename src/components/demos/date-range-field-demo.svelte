<script lang="ts">
	import { DateRangeField } from "$lib";
	import { CalendarDate } from "@internationalized/date";

	let value = {
		start: new CalendarDate(2024, 1, 1),
		end: new CalendarDate(2024, 3, 1)
	};
</script>

<DateRangeField.Root bind:value>
	<div class="flex w-full max-w-[280px] flex-col gap-1.5">
		<DateRangeField.Label class="block select-none text-sm font-medium"
			>Hotel dates</DateRangeField.Label
		>
		<DateRangeField.Input
			let:segments
			class="flex h-input w-full max-w-[280px] select-none items-center rounded-input border border-border-input bg-background py-3 px-2 text-sm tracking-[0.01em] text-muted-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
		>
			{#each segments.start as { part, value }}
				<div class="inline-block select-none">
					{#if part === "literal"}
						<DateRangeField.Segment type="start" {part} class="p-1">
							{value}
						</DateRangeField.Segment>
					{:else}
						<DateRangeField.Segment
							type="start"
							{part}
							class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:!ring-0 focus-visible:!ring-offset-0"
						>
							{value}
						</DateRangeField.Segment>
					{/if}
				</div>
			{/each}
			<div aria-hidden class="px-1">–⁠⁠⁠⁠⁠</div>
			{#each segments.end as { part, value }}
				<div class="inline-block select-none">
					{#if part === "literal"}
						<DateRangeField.Segment type="end" {part} class="p-1">
							{value}
						</DateRangeField.Segment>
					{:else}
						<DateRangeField.Segment
							type="end"
							{part}
							class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:!ring-0 focus-visible:!ring-offset-0"
						>
							{value}
						</DateRangeField.Segment>
					{/if}
				</div>
			{/each}
		</DateRangeField.Input>
	</div>
</DateRangeField.Root>
