<script lang="ts">
	import { CalendarDateTime, toZoned } from "@internationalized/date";
	import { TimeField } from "bits-ui";
	const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
	const zonedDateTime = toZoned(calendarDateTime, "America/New_York");
</script>

<TimeField.Root granularity="second" value={zonedDateTime}>
	<div class="flex w-full max-w-[280px] flex-col gap-1.5">
		<TimeField.Label class="block select-none text-sm font-medium"
			>Appointment Time</TimeField.Label
		>
		<TimeField.Input
			name="hello"
			class="h-input rounded-input border-border-input bg-background text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover data-invalid:border-destructive flex w-full select-none items-center border px-2 py-3 text-sm tracking-[0.01em] "
		>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<div class="inline-block select-none">
						{#if part === "literal"}
							<TimeField.Segment {part} class="text-muted-foreground p-1">
								{value}
							</TimeField.Segment>
						{:else}
							<TimeField.Segment
								{part}
								class="rounded-5px hover:bg-muted focus:bg-muted focus:text-foreground aria-[valuetext=Empty]:text-muted-foreground data-invalid:text-destructive focus-visible:ring-0! focus-visible:ring-offset-0! px-1 py-1"
							>
								{value}
							</TimeField.Segment>
						{/if}
					</div>
				{/each}
			{/snippet}
		</TimeField.Input>
	</div>
</TimeField.Root>
