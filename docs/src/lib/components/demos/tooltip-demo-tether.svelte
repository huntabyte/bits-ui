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
		<div
			class="flex items-center justify-between rounded-10px border border-border bg-background-alt p-3 shadow-mini"
		>
			<div>
				<p class="text-sm font-semibold">Data sources</p>
				<p class="mt-0.5 text-xs text-foreground/60">
					Pull live data from connected integrations
				</p>
			</div>
			<Tooltip.Trigger
				tether={actionsTether}
				payload={{
					label: "Sync now",
					description: "Refreshes every connected source and recalculates all metrics.",
					shortcut: "S",
				}}
				class="inline-flex h-8 shrink-0 items-center justify-center rounded-9px bg-background px-3 text-xs font-medium text-foreground/80 shadow-mini ring-dark ring-offset-background transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98] active:bg-dark-10"
			>
				Sync now
			</Tooltip.Trigger>
		</div>

		<div
			class="flex items-center justify-between rounded-10px border border-border bg-background-alt p-3 shadow-mini"
		>
			<div>
				<p class="text-sm font-semibold">Sharing</p>
				<p class="mt-0.5 text-xs text-foreground/60">Share a live view with your team</p>
			</div>
			<Tooltip.Trigger
				tether={actionsTether}
				payload={{
					label: "Copy share link",
					description: "Creates a read-only link with the current filter and date range.",
					shortcut: "L",
				}}
				class="inline-flex h-8 shrink-0 items-center justify-center rounded-9px bg-background px-3 text-xs font-medium text-foreground/80 shadow-mini ring-dark ring-offset-background transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98] active:bg-dark-10"
			>
				Copy link
			</Tooltip.Trigger>
		</div>

		<div
			class="flex items-center justify-between rounded-10px border border-border bg-background-alt p-3 shadow-mini sm:col-span-2"
		>
			<div>
				<p class="text-sm font-semibold">Automation</p>
				<p class="mt-0.5 text-xs text-foreground/60">
					Send recurring summaries to your team
				</p>
			</div>
			<div class="flex items-center gap-2">
				<Tooltip.Trigger
					tether={actionsTether}
					payload={{
						label: "Schedule digest",
						description:
							"Sends this dashboard summary to your team every Monday at 9:00 AM.",
						shortcut: "D",
					}}
					class="inline-flex h-8 shrink-0 items-center justify-center rounded-9px bg-background px-3 text-xs font-medium text-foreground/80 shadow-mini ring-dark ring-offset-background transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98] active:bg-dark-10"
				>
					Schedule digest
				</Tooltip.Trigger>
				<Tooltip.Trigger
					tether={actionsTether}
					payload={{
						label: "Pause digest",
						description:
							"Stops all scheduled sends while keeping existing recipients intact.",
						shortcut: "P",
					}}
					class="inline-flex h-8 shrink-0 items-center justify-center rounded-9px bg-background px-3 text-xs font-medium text-foreground/80 shadow-mini ring-dark ring-offset-background transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98] active:bg-dark-10"
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
					class="z-50 origin-(--bits-tooltip-content-transform-origin) data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95"
				>
					<div
						class="z-0 w-[280px] rounded-input border border-dark-10 bg-background p-3 shadow-popover outline-hidden"
					>
						<div class="flex items-center justify-between gap-2">
							<p class="text-sm font-semibold">{payload?.label ?? "Action"}</p>
							<kbd
								class="rounded-[4px] border border-dark-10 bg-background-alt px-1.5 py-0.5 font-mono text-[11px] text-foreground/65"
							>
								{payload?.shortcut ?? "?"}
							</kbd>
						</div>
						<p class="mt-1 text-xs leading-relaxed text-foreground/70">
							{payload?.description ??
								"Hover a detached action button to see what it does."}
						</p>
					</div>
				</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
