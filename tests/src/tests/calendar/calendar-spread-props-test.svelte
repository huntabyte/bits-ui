<script lang="ts">
	import { Calendar } from "bits-ui";

	let { type = "single" }: { type?: "single" | "multiple" } = $props();

	// `placeholder` is intentionally not bound, and the spread is reassigned during mount
	let attrs: Record<string, unknown> = $state({ "data-testid": "calendar" });
	$effect(() => {
		attrs = { "data-testid": "calendar", "data-updated": "" };
	});
</script>

<Calendar.Root {type} {...attrs}>
	<Calendar.Heading data-testid="heading" />
	<Calendar.MonthSelect data-testid="month-select" />
	<Calendar.YearSelect data-testid="year-select" />
</Calendar.Root>
