<script lang="ts">
	import { Calendar, Select } from "$lib";
	import {
		DateFormatter,
		getLocalTimeZone,
		today,
		type DateValue
	} from "@internationalized/date";
	import { CaretRight, CaretLeft } from "phosphor-svelte";

	const isDateUnavailable: Calendar.Props["isDateUnavailable"] = (date) => {
		return date.day === 17 || date.day === 18;
	};

	const monthOptions = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	].map((month, i) => ({ value: i + 1, label: month }));

	const monthFmt = new DateFormatter("en-US", {
		month: "long"
	});

	const yearOptions = Array.from({ length: 100 }, (_, i) => ({
		label: String(new Date().getFullYear() - i),
		value: new Date().getFullYear() - i
	}));

	export let placeholder = today(getLocalTimeZone());
	// if you try to `bind:value` to the calendar.root, the select
	// menus no longer work...
	export let value: DateValue | undefined = undefined;

	$: defaultYear = placeholder
		? {
				value: placeholder.year,
				label: String(placeholder.year)
		  }
		: undefined;

	$: defaultMonth = placeholder
		? {
				value: placeholder.month,
				label: monthFmt.format(placeholder.toDate(getLocalTimeZone()))
		  }
		: undefined;
</script>

<Calendar.Root
	class="mt-6 rounded-[15px] border border-dark-10 bg-background p-[22px] shadow-card"
	let:months
	let:weekdays
	bind:placeholder
	bind:value
	{isDateUnavailable}
	weekdayFormat="short"
	fixedWeeks={true}
>
	<Calendar.Header class="flex items-center justify-between">
		<Select.Root
			selected={defaultMonth}
			items={monthOptions}
			onSelectedChange={(v) => {
				if (!v || !placeholder) {
					return;
				} else if (v.value === placeholder?.month) return;
				placeholder = placeholder.set({ month: v.value });
			}}
		>
			<Select.Trigger aria-label="Select month">
				<Select.Value placeholder="Select month" />
			</Select.Trigger>
			<Select.Content class="max-h-[200px] overflow-y-auto">
				{#each monthOptions as m, i (i)}
					<Select.Item value={m.value} label={m.label}>
						{m.label}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Select.Root
			selected={defaultYear}
			items={yearOptions}
			onSelectedChange={(v) => {
				if (!v || !placeholder) {
					return;
				} else if (v.value === placeholder?.year) return;
				placeholder = placeholder.set({ year: v.value });
			}}
		>
			<Select.Trigger aria-label="Select year">
				<Select.Value placeholder="Select year" />
			</Select.Trigger>
			<Select.Content class="max-h-[200px] overflow-y-auto">
				{#each yearOptions as y, i (i)}
					<Select.Item value={y.value} label={y.label}>
						{y.label}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</Calendar.Header>
	<div
		class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
	>
		{#each months as month, i (i)}
			<Calendar.Grid class="w-full border-collapse select-none space-y-1">
				<Calendar.GridHead>
					<Calendar.GridRow class="mb-1 flex w-full justify-between">
						{#each weekdays as day}
							<Calendar.HeadCell
								class="w-10 rounded-md text-xs !font-normal text-muted-foreground"
							>
								<div>{day.slice(0, 2)}</div>
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="flex w-full">
							{#each weekDates as date}
								<Calendar.Cell
									{date}
									class="relative !p-0 text-center text-sm sq-10"
								>
									<Calendar.Day
										{date}
										month={month.value}
										class="group relative inline-flex items-center justify-center whitespace-nowrap rounded-9px border border-transparent bg-transparent p-0 text-sm font-normal text-foreground sq-10 hover:border-foreground data-[disabled]:pointer-events-none data-[outside-month]:pointer-events-none data-[selected]:bg-foreground data-[selected]:font-medium data-[disabled]:text-foreground/30 data-[selected]:text-background data-[unavailable]:text-muted-foreground data-[unavailable]:line-through"
									>
										<div
											class="absolute top-[5px] hidden rounded-full bg-foreground sq-1 group-data-[today]:block group-data-[selected]:bg-background"
										/>
										{date.day}
									</Calendar.Day>
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</div>
</Calendar.Root>
