<script lang="ts">
	import { Calendar } from "bits-ui";
	import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date";

	const currentDate = today(getLocalTimeZone());
	let value = $state(today(getLocalTimeZone()));

	const formatter = new DateFormatter("en-US", {
		month: "long",
	});

	const monthList = Array.from({ length: 12 }, (_, i) => {
		const month = currentDate.set({ month: i + 1 });
		return {
			value: month.month,
			label: formatter.format(month.toDate(getLocalTimeZone())),
		};
	});

	const currentYear = new Date().getFullYear();
	const yearList = Array.from({ length: 30 }, (_, i) => currentYear - i);
	let placeholder = $state(currentDate);
</script>

<Calendar.Root
	class="border-dark-10 bg-background-alt shadow-card mt-6 rounded-[15px] border p-[22px]"
	weekdayFormat="short"
	fixedWeeks={true}
	bind:placeholder
	type="single"
	bind:value
>
	{#snippet children({ months, weekdays })}
		<Calendar.Header class="flex items-center justify-between gap-3">
			<select
				aria-label="Select month"
				value={placeholder.month}
				class="w-full"
				onchange={(e) => {
					const month = parseInt(e.currentTarget.value);
					placeholder = placeholder.set({ month });
				}}
			>
				{#each monthList as month}
					<option value={month.value}>{month.label}</option>
				{/each}
			</select>
			<select
				aria-label="Select year"
				value={placeholder.year}
				onchange={(e) => {
					const year = parseInt(e.currentTarget.value);
					placeholder = placeholder.set({ year });
				}}
			>
				{#each yearList as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		</Calendar.Header>
		<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
			{#each months as month, i (i)}
				<Calendar.Grid class="w-full border-collapse select-none space-y-1">
					<Calendar.GridHead>
						<Calendar.GridRow class="mb-1 flex w-full justify-between">
							{#each weekdays as day}
								<Calendar.HeadCell
									class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
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
										month={month.value}
										class="p-0! relative size-10 text-center text-sm"
									>
										<Calendar.Day
											class="rounded-9px text-foreground hover:border-foreground data-selected:bg-foreground data-disabled:text-foreground/30 data-selected:text-background data-unavailable:text-muted-foreground data-disabled:pointer-events-none data-outside-month:pointer-events-none data-selected:font-medium data-unavailable:line-through group relative inline-flex size-10 items-center justify-center whitespace-nowrap border border-transparent bg-transparent p-0 text-sm font-normal"
										>
											<div
												class="bg-foreground group-data-selected:bg-background group-data-today:block absolute top-[5px] hidden size-1 rounded-full"
											></div>
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
	{/snippet}
</Calendar.Root>
