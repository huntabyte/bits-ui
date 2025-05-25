<script lang="ts">
	import { Button, Calendar, Separator } from "bits-ui";
	import CaretLeft from "phosphor-svelte/lib/CaretLeft";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import { getLocalTimeZone, today } from "@internationalized/date";

	const currentDate = today(getLocalTimeZone());

	let value = $state(currentDate);

	const presets = [
		{
			label: "Today",
			onclick: () => {
				value = currentDate;
			},
		},
		{
			label: "Tomorrow",
			onclick: () => {
				value = currentDate.add({ days: 1 });
			},
		},
		{
			label: "In 3 days",
			onclick: () => {
				value = currentDate.add({ days: 3 });
			},
		},
		{
			label: "In a week",
			onclick: () => {
				value = currentDate.add({ days: 7 });
			},
		},
		{
			label: "In a month",
			onclick: () => {
				value = currentDate.add({ months: 1 });
			},
		},
		{
			label: "In a year",
			onclick: () => {
				value = currentDate.add({ years: 1 });
			},
		},
	];
</script>

<div
	class="border-dark-10 bg-background-alt shadow-card mt-6 flex max-w-[324px] flex-col gap-4 rounded-[15px] border p-[22px]"
>
	<Calendar.Root weekdayFormat="short" fixedWeeks={true} type="single" bind:value>
		{#snippet children({ months, weekdays })}
			<Calendar.Header class="flex items-center justify-between">
				<Calendar.PrevButton
					class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98] active:transition-all"
				>
					<CaretLeft class="size-6" />
				</Calendar.PrevButton>
				<Calendar.Heading class="text-[15px] font-medium" />
				<Calendar.NextButton
					class="rounded-9px bg-background-alt hover:bg-muted inline-flex size-10 items-center justify-center active:scale-[0.98] active:transition-all"
				>
					<CaretRight class="size-6" />
				</Calendar.NextButton>
			</Calendar.Header>
			<div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
				{#each months as month, i (i)}
					<Calendar.Grid class="w-full border-collapse select-none space-y-1">
						<Calendar.GridHead>
							<Calendar.GridRow class="mb-1 flex w-full justify-between">
								{#each weekdays as day, i (i)}
									<Calendar.HeadCell
										class="text-muted-foreground font-normal! w-10 rounded-md text-xs"
									>
										<div>{day.slice(0, 2)}</div>
									</Calendar.HeadCell>
								{/each}
							</Calendar.GridRow>
						</Calendar.GridHead>
						<Calendar.GridBody>
							{#each month.weeks as weekDates, i (i)}
								<Calendar.GridRow class="flex w-full">
									{#each weekDates as date, i (i)}
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
	<Separator.Root class="bg-dark-10 h-px w-full" />
	<div class="flex w-full flex-row flex-wrap items-center gap-2">
		{#each presets as preset (preset.label)}
			<Button.Root
				class="border-dark-10 text-foreground shadow-mini hover:bg-foreground/5 inline-flex h-8 flex-1 select-none items-center justify-center whitespace-nowrap rounded-md border px-[17px] text-xs font-medium transition-all active:scale-[0.98]"
				onclick={preset.onclick}
			>
				<span class="sr-only"> Set date to </span>
				{preset.label}
			</Button.Root>
		{/each}
	</div>
</div>
