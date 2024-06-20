<script lang="ts">
	import { CalendarDate, CalendarDateTime, toZoned } from "@internationalized/date";
	import { DateField } from "bits-ui";

	const calendarDate = new CalendarDate(1980, 1, 20);
	const calendarDateTime = new CalendarDateTime(1980, 1, 20, 12, 30, 0, 0);
	const zonedDateTime = toZoned(calendarDateTime, "America/New_York");

	let value = $state(zonedDateTime);
</script>

<DateField.Root bind:value granularity="second">
	<div class="flex w-full flex-col gap-1.5">
		<DateField.Label class="block select-none text-sm font-medium">Birthday</DateField.Label>
		<DateField.Input
			class="flex h-input w-full  select-none items-center rounded-input border border-border-input bg-background px-2 py-3 text-sm tracking-[0.01em] text-foreground focus-within:border-border-input-hover focus-within:shadow-date-field-focus hover:border-border-input-hover"
		>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<div class="inline-block select-none">
						{#if part === "literal"}
							<DateField.Segment {part} class="p-1 text-muted-foreground">
								{value}
							</DateField.Segment>
						{:else}
							<DateField.Segment
								{part}
								class="rounded-5px px-1 py-1 hover:bg-muted focus:bg-muted focus:text-foreground focus-visible:!ring-0 focus-visible:!ring-offset-0 aria-[valuetext=Empty]:text-muted-foreground"
							>
								{value}
							</DateField.Segment>
						{/if}
					</div>
				{/each}
			{/snippet}
		</DateField.Input>
	</div>
</DateField.Root>
