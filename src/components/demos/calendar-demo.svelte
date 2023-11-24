<script lang="ts">
	import { Calendar } from "$lib";
	import { cn } from "@/utils";
	import { ChevronLeft, ChevronRight } from "lucide-svelte";
	import { buttonVariants } from "../ui/button";
</script>

<Calendar.Root class="p-3 rounded-md border" let:months let:daysOfWeek>
	<Calendar.Header class="flex justify-between items-center">
		<Calendar.PrevButton
			class={cn(
				buttonVariants({ variant: "outline" }),
				"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
			)}
		>
			<ChevronLeft class="h-4 w-4" />
		</Calendar.PrevButton>
		<Calendar.Heading class="text-sm font-medium" />
		<Calendar.NextButton
			class={cn(
				buttonVariants({ variant: "outline" }),
				"h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
			)}
		>
			<ChevronRight class="h-4 w-4" />
		</Calendar.NextButton>
	</Calendar.Header>
	<div class="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 pt-4">
		{#each months as month}
			<Calendar.Grid class="w-full border-collapse space-y-1">
				<Calendar.GridHead>
					<Calendar.GridRow class="flex w-full justify-between">
						{#each daysOfWeek as day}
							<Calendar.GridHeadCell
								class="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"
							>
								<div>{day}</div>
							</Calendar.GridHeadCell>
						{/each}
					</Calendar.GridRow>
				</Calendar.GridHead>
				<Calendar.GridBody>
					{#each month.weeks as weekDates}
						<Calendar.GridRow class="flex w-full mt-2">
							{#each weekDates as date}
								<Calendar.GridBodyCell
									{date}
									class="h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20"
								>
									<Calendar.Date
										{date}
										month={month.value}
										class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-muted-foreground opacity-50"
									/>
								</Calendar.GridBodyCell>
							{/each}
						</Calendar.GridRow>
					{/each}
				</Calendar.GridBody>
			</Calendar.Grid>
		{/each}
	</div>
</Calendar.Root>
