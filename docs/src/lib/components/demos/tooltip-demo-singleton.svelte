<script lang="ts">
	import { Tooltip } from "bits-ui";

	type ColumnPayload = {
		name: string;
		description: string;
	};

	const boardTether = Tooltip.createTether<ColumnPayload>();

	const columns = [
		{
			id: "backlog",
			label: "Backlog",
			payload: {
				name: "Backlog",
				description: "Unstarted ideas and tasks waiting to be scoped and prioritized.",
			},
		},
		{
			id: "in-progress",
			label: "In Progress",
			payload: {
				name: "In Progress",
				description: "Active work with an assignee and an expected ship date.",
			},
		},
		{
			id: "blocked",
			label: "Blocked",
			payload: {
				name: "Blocked",
				description: "Work that cannot move until an external dependency is resolved.",
			},
		},
		{
			id: "done",
			label: "Done",
			payload: {
				name: "Done",
				description: "Completed tasks ready for release notes and QA sign-off.",
			},
		},
	];
</script>

<Tooltip.Provider delayDuration={200} skipDelayDuration={600}>
	<Tooltip.Root tether={boardTether}>
		{#snippet children({ payload })}
			<div
				class="rounded-10px border-border bg-background-alt shadow-mini flex flex-wrap items-center gap-1 border p-1"
			>
				{#each columns as column (column.id)}
					<Tooltip.Trigger
						tether={boardTether}
						payload={column.payload}
						class="rounded-9px text-foreground/80 hover:bg-muted data-[state=open]:bg-muted inline-flex h-9 items-center px-3 text-sm font-medium transition-colors"
					>
						{column.label}
					</Tooltip.Trigger>
				{/each}
			</div>

			<Tooltip.Portal>
				<Tooltip.Content
					sideOffset={8}
					class="data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin)"
				>
					<div
						class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 w-[280px] border p-3"
					>
						<p class="text-sm font-semibold">{payload?.name ?? "Column"}</p>
						<p class="text-foreground/70 mt-1 text-xs leading-relaxed">
							{payload?.description ??
								"Hover a column to see team workflow guidance."}
						</p>
					</div>
				</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
