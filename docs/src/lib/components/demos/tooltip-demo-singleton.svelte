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
				class="flex flex-wrap items-center gap-1 rounded-10px border border-border bg-background-alt p-1 shadow-mini"
			>
				{#each columns as column (column.id)}
					<Tooltip.Trigger
						tether={boardTether}
						payload={column.payload}
						class="inline-flex h-9 items-center rounded-9px px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted data-[state=open]:bg-muted"
					>
						{column.label}
					</Tooltip.Trigger>
				{/each}
			</div>

			<Tooltip.Portal>
				<Tooltip.Content
					sideOffset={8}
					class="z-50 origin-(--bits-tooltip-content-transform-origin) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95"
				>
					<div
						class="z-0 w-[280px] rounded-input border border-dark-10 bg-background p-3 shadow-popover outline-hidden"
					>
						<p class="text-sm font-semibold">{payload?.name ?? "Column"}</p>
						<p class="mt-1 text-xs leading-relaxed text-foreground/70">
							{payload?.description ??
								"Hover a column to see team workflow guidance."}
						</p>
					</div>
				</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
