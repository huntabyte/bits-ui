<script lang="ts">
	import { Calendar } from "$lib";
	import { cn } from "@/utils";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import { buttonVariants } from "../ui/button";
</script>

<Calendar.Root
	class="rounded-card border bg-background p-6 shadow-card"
	let:months
	let:daysOfWeek
>
	<Calendar.Header class="flex items-center justify-between">
		<Calendar.PrevButton
			class={cn(
				buttonVariants({ variant: "outline" }),
				"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
			)}
		>
			<ChevronLeft class="h-4 w-4" />
		</Calendar.PrevButton>
		<Calendar.Heading class="font-medium" />
		<Calendar.NextButton
			class={cn(
				buttonVariants({ variant: "outline" }),
				"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
			)}
		>
			<ChevronRight class="h-4 w-4" />
		</Calendar.NextButton>
	</Calendar.Header>
	<div
		class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
	>
		{#each months as month}
			<Calendar.Grid class="w-full border-collapse space-y-1">
				<Calendar.GridHead>
					<Calendar.GridRow class="flex w-full justify-between">
						{#each daysOfWeek as day}
							<Calendar.HeadCell
								class="w-9 rounded-md text-[0.8rem] font-medium text-muted-foreground"
							>
								<div>{day}</div>
							</Calendar.HeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="mt-2 flex w-full gap-1">
							{#each weekDates as date}
								<Calendar.Cell
									{date}
									class="relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-muted first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
								>
									<Calendar.Date
										{date}
										month={month.value}
										class="focus-visible:ring-ring inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md bg-background p-0 text-sm font-normal text-foreground ring-offset-background transition-colors hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:bg-muted data-[outside-month]:pointer-events-none data-[outside-month]:opacity-0"
									/>
								</Calendar.Cell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</div>
</Calendar.Root>
