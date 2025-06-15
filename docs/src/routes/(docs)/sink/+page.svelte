<script lang="ts">
	import Calendar from "./calendar.svelte";
	import Combobox from "./combobox.svelte";
	import MonthCal from "./month-cal.svelte";
	import RangeCal from "./range-cal.svelte";
	import RangeMonthCal from "./range-month-cal.svelte";

	let myValue = $state("");
	const testItems = [
		{ value: "mango", label: "Mango" },
		{ value: "watermelon", label: "Watermelon" },
		{ value: "apple", label: "Apple" },
	];
</script>

<div class="mt-4">
	<button onclick={() => (myValue = "apple")}> Select Apple </button>
	<!-- <Combobox items={testItems} type="single" bind:value={myValue} /> -->
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
