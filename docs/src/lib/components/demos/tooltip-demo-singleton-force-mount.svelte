<script lang="ts">
	import { Tooltip } from "bits-ui";
	import { fly } from "svelte/transition";

	type PlanPayload = {
		name: string;
		description: string;
	};

	const planTether = Tooltip.createTether<PlanPayload>();

	const plans = [
		{
			id: "starter",
			label: "Starter",
			payload: {
				name: "Starter plan",
				description: "Great for small teams shipping one project with basic analytics.",
			},
		},
		{
			id: "growth",
			label: "Growth",
			payload: {
				name: "Growth plan",
				description: "Adds feature flags, role permissions, and alert integrations.",
			},
		},
		{
			id: "enterprise",
			label: "Enterprise",
			payload: {
				name: "Enterprise plan",
				description: "Includes SSO, audit trails, and dedicated support response SLAs.",
			},
		},
	];
</script>

<Tooltip.Provider delayDuration={200}>
	<Tooltip.Root tether={planTether}>
		{#snippet children({ payload })}
			<div class="rounded-10px border-border bg-background-alt shadow-mini flex flex-wrap items-center gap-1 border p-1">
				{#each plans as plan (plan.id)}
					<Tooltip.Trigger
						tether={planTether}
						payload={plan.payload}
						class="rounded-9px text-foreground/80 hover:bg-muted data-[state=open]:bg-muted inline-flex h-9 items-center px-3 text-sm font-medium transition-colors"
					>
						{plan.label}
					</Tooltip.Trigger>
				{/each}
			</div>

			<Tooltip.Portal>
				<Tooltip.Content sideOffset={8} forceMount>
					{#snippet child({ wrapperProps, props, open })}
						{#if open}
							<div {...wrapperProps}>
								<div {...props} transition:fly={{ y: 8, duration: 180 }}>
									<div
										class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 w-[300px] border p-3"
									>
										<p class="text-sm font-semibold">{payload?.name ?? "Plan details"}</p>
										<p class="text-foreground/70 mt-1 text-xs leading-relaxed">
											{payload?.description ??
												"forceMount keeps one tooltip node mounted so transitions stay smooth while content changes."}
										</p>
									</div>
								</div>
							</div>
						{/if}
					{/snippet}
				</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
