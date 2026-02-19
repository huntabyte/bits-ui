<script lang="ts">
	import { Tooltip } from "bits-ui";
	import CursorClick from "phosphor-svelte/lib/CursorClick";

	type StepPayload = {
		title: string;
		description: string;
	};

	const setupTether = Tooltip.createTether<StepPayload>();
	let open = $state(false);
	let triggerId = $state<string | null>(null);

	function openStep(id: string) {
		triggerId = id;
		open = true;
	}
</script>

<Tooltip.Provider delayDuration={200}>
	<div class="flex w-full flex-col items-center gap-3">
		<div
			class="rounded-10px border-border bg-background-alt shadow-mini inline-flex w-fit items-center border p-1"
		>
			<Tooltip.Trigger
				id="setup-project"
				tether={setupTether}
				payload={{
					title: "Create project",
					description:
						"Projects keep workflows, environments, and permissions scoped to one team.",
				}}
				class="rounded-9px text-foreground/80 hover:bg-muted inline-flex h-9 items-center px-3 text-sm font-medium"
			>
				Project
			</Tooltip.Trigger>
			<Tooltip.Trigger
				id="setup-members"
				tether={setupTether}
				payload={{
					title: "Invite members",
					description: "Add collaborators now so every task gets ownership from day one.",
				}}
				class="rounded-9px text-foreground/80 hover:bg-muted inline-flex h-9 items-center px-3 text-sm font-medium"
			>
				Members
			</Tooltip.Trigger>
			<Tooltip.Trigger
				id="setup-deploy"
				tether={setupTether}
				payload={{
					title: "Configure deploy",
					description:
						"Connect a repository and pick a production branch for one-click releases.",
				}}
				class="rounded-9px text-foreground/80 hover:bg-muted inline-flex h-9 items-center px-3 text-sm font-medium"
			>
				Deploy
			</Tooltip.Trigger>
		</div>

		<div class="flex w-full max-w-xs items-center gap-3">
			<div class="bg-border h-px flex-1"></div>
			<span class="text-foreground/35 text-[10px] font-medium uppercase tracking-widest"
				>open directly</span
			>
			<div class="bg-border h-px flex-1"></div>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<button
				type="button"
				class="border-border bg-background-alt shadow-mini hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden group inline-flex h-8 items-center gap-1.5 rounded-full border px-4 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
				onclick={() => openStep("setup-members")}
			>
				<CursorClick
					class="text-foreground/40 group-hover:text-foreground/60 size-3.5 transition-colors"
				/>
				<span class="text-foreground/65 group-hover:text-foreground/80 transition-colors"
					>Members</span
				>
			</button>
			<button
				type="button"
				class="border-border bg-background-alt shadow-mini hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden group inline-flex h-8 items-center gap-1.5 rounded-full border px-4 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
				onclick={() => openStep("setup-deploy")}
			>
				<CursorClick
					class="text-foreground/40 group-hover:text-foreground/60 size-3.5 transition-colors"
				/>
				<span class="text-foreground/65 group-hover:text-foreground/80 transition-colors"
					>Deploy</span
				>
			</button>
		</div>
	</div>

	<Tooltip.Root tether={setupTether} bind:open bind:triggerId>
		{#snippet children({ payload })}
			<Tooltip.Portal>
				<Tooltip.Content
					sideOffset={8}
					class="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 origin-(--bits-tooltip-content-transform-origin)"
				>
					<div
						class="rounded-input border-dark-10 bg-background shadow-popover outline-hidden z-0 w-[290px] border p-3"
					>
						<p class="text-sm font-semibold">{payload?.title ?? "Setup step"}</p>
						<p class="text-foreground/70 mt-1 text-xs leading-relaxed">
							{payload?.description ??
								"Open a step manually to guide first-time users."}
						</p>
					</div>
				</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
