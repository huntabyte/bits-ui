<script lang="ts">
	import Calendar from "./calendar.svelte";
	import MonthCal from "./month-cal.svelte";
	import RangeCal from "./range-cal.svelte";
	import RangeMonthCal from "./range-month-cal.svelte";
</script>

<div class="mt-4">
	<div class="flex flex-col gap-4">
		<div class="flex">
			<Calendar></Calendar>
		</div>
		<div class="flex">
			<RangeCal></RangeCal>
		</div>
		<div class="flex">
			<MonthCal></MonthCal>
		</div>
		<div class="flex">
			<RangeMonthCal></RangeMonthCal>
		</div>
	</div>
</div>
