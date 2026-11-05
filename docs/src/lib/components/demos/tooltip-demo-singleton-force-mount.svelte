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
			<div
				class="flex flex-wrap items-center gap-1 rounded-10px border border-border bg-background-alt p-1 shadow-mini"
			>
				{#each plans as plan (plan.id)}
					<Tooltip.Trigger
						tether={planTether}
						payload={plan.payload}
						class="inline-flex h-9 items-center rounded-9px px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted data-[state=open]:bg-muted"
					>
						{plan.label}
					</Tooltip.Trigger>
				{/each}
			</div>

			<Tooltip.Portal>
				<Tooltip.Content class="z-50" sideOffset={8} forceMount>
					{#snippet child({ wrapperProps, props, open })}
						{#if open}
							<div {...wrapperProps}>
								<div {...props} transition:fly={{ y: 8, duration: 180 }}>
									<div
										class="z-0 w-[300px] rounded-input border border-dark-10 bg-background p-3 shadow-popover outline-hidden"
									>
										<p class="text-sm font-semibold">
											{payload?.name ?? "Plan details"}
										</p>
										<p class="mt-1 text-xs leading-relaxed text-foreground/70">
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
