<script lang="ts">
	import { Tooltip } from "bits-ui";

	type ActionTooltipPayload = {
		label: string;
		description: string;
		shortcut: string;
	};

	const actionsTether = Tooltip.createTether<ActionTooltipPayload>();
</script>

<Tooltip.Provider delayDuration={200}>
	<div class="mx-auto grid w-full max-w-[760px] gap-2 sm:grid-cols-2">
		<div class="rounded-10px border-border bg-background-alt shadow-mini flex items-center justify-between border p-3">
			<div>
				<p class="text-sm font-semibold">Data sources</p>
				<p class="text-foreground/60 mt-0.5 text-xs">Pull live data from connected integrations</p>
			</div>
			<Tooltip.Trigger
				tether={actionsTether}
				payload={{
					label: "Sync now",
					description: "Refreshes every connected source and recalculates all metrics.",
					shortcut: "S",
				}}
				class="rounded-9px bg-background text-foreground/80 ring-dark ring-offset-background shadow-mini hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden active:bg-dark-10 inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-medium transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				Sync now
			</Tooltip.Trigger>
		</div>

		<div class="rounded-10px border-border bg-background-alt shadow-mini flex items-center justify-between border p-3">
			<div>
				<p class="text-sm font-semibold">Sharing</p>
				<p class="text-foreground/60 mt-0.5 text-xs">Share a live view with your team</p>
			</div>
			<Tooltip.Trigger
				tether={actionsTether}
				payload={{
					label: "Copy share link",
					description: "Creates a read-only link with the current filter and date range.",
					shortcut: "L",
				}}
				class="rounded-9px bg-background text-foreground/80 ring-dark ring-offset-background shadow-mini hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden active:bg-dark-10 inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-medium transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2"
			>
				Copy link
			</Tooltip.Trigger>
		</div>

		<div class="rounded-10px border-border bg-background-alt shadow-mini flex items-center justify-between border p-3 sm:col-span-2">
			<div>
				<p class="text-sm font-semibold">Automation</p>
				<p class="text-foreground/60 mt-0.5 text-xs">Send recurring summaries to your team</p>
			</div>
			<div class="flex items-center gap-2">
				<Tooltip.Trigger
					tether={actionsTether}
					payload={{
						label: "Schedule digest",
						description: "Sends this dashboard summary to your team every Monday at 9:00 AM.",
						shortcut: "D",
					}}
					class="rounded-9px bg-background text-foreground/80 ring-dark ring-offset-background shadow-mini hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden active:bg-dark-10 inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-medium transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2"
				>
					Schedule digest
				</Tooltip.Trigger>
				<Tooltip.Trigger
					tether={actionsTether}
					payload={{
						label: "Pause digest",
						description: "Stops all scheduled sends while keeping existing recipients intact.",
						shortcut: "P",
					}}
					class="rounded-9px bg-background text-foreground/80 ring-dark ring-offset-background shadow-mini hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden active:bg-dark-10 inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-medium transition-all active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2"
				>
					Pause digest
				</Tooltip.Trigger>
			</div>
		</div>
	</div>

	<Tooltip.Root tether={actionsTether}>
		{#snippet children({ payload })}
			<Tooltip.Portal>
				<Tooltip.Content
					sideOffset={8}
					class="data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin)"
				>
					<div
						class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 w-[280px] border p-3"
					>
						<div class="flex items-center justify-between gap-2">
							<p class="text-sm font-semibold">{payload?.label ?? "Action"}</p>
							<kbd
								class="rounded-[4px] border-dark-10 text-foreground/65 bg-background-alt border px-1.5 py-0.5 font-mono text-[11px]"
							>
								{payload?.shortcut ?? "?"}
							</kbd>
						</div>
						<p class="text-foreground/70 mt-1 text-xs leading-relaxed">
							{payload?.description ?? "Hover a detached action button to see what it does."}
						</p>
					</div>
				</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
