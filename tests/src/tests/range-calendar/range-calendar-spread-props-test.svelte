<script lang="ts">
	import { RangeCalendar } from "bits-ui";

	// `placeholder` is intentionally not bound, and the spread is reassigned during mount
	// eslint-disable-next-line svelte/prefer-writable-derived -- reproduces the reassignment
	let attrs: Record<string, unknown> = $state({ "data-testid": "calendar" });
	$effect(() => {
		attrs = { "data-testid": "calendar", "data-updated": "" };
	});
</script>

<RangeCalendar.Root {...attrs}>
	<RangeCalendar.Heading data-testid="heading" />
	<RangeCalendar.MonthSelect data-testid="month-select" />
	<RangeCalendar.YearSelect data-testid="year-select" />
</RangeCalendar.Root>
