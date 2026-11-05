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
			class="inline-flex w-fit items-center rounded-10px border border-border bg-background-alt p-1 shadow-mini"
		>
			<Tooltip.Trigger
				id="setup-project"
				tether={setupTether}
				payload={{
					title: "Create project",
					description:
						"Projects keep workflows, environments, and permissions scoped to one team.",
				}}
				class="inline-flex h-9 items-center rounded-9px px-3 text-sm font-medium text-foreground/80 hover:bg-muted"
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
				class="inline-flex h-9 items-center rounded-9px px-3 text-sm font-medium text-foreground/80 hover:bg-muted"
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
				class="inline-flex h-9 items-center rounded-9px px-3 text-sm font-medium text-foreground/80 hover:bg-muted"
			>
				Deploy
			</Tooltip.Trigger>
		</div>

		<div class="flex w-full max-w-xs items-center gap-3">
			<div class="h-px flex-1 bg-border"></div>
			<span class="text-[10px] font-medium tracking-widest text-foreground/35 uppercase"
				>open directly</span
			>
			<div class="h-px flex-1 bg-border"></div>
		</div>

		<div class="flex flex-wrap items-center justify-center gap-2">
			<button
				type="button"
				class="group inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background-alt px-4 text-xs font-medium shadow-mini transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden focus-visible:outline-none active:scale-[0.98]"
				onclick={() => openStep("setup-members")}
			>
				<CursorClick
					class="size-3.5 text-foreground/40 transition-colors group-hover:text-foreground/60"
				/>
				<span class="text-foreground/65 transition-colors group-hover:text-foreground/80"
					>Members</span
				>
			</button>
			<button
				type="button"
				class="group inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background-alt px-4 text-xs font-medium shadow-mini transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden focus-visible:outline-none active:scale-[0.98]"
				onclick={() => openStep("setup-deploy")}
			>
				<CursorClick
					class="size-3.5 text-foreground/40 transition-colors group-hover:text-foreground/60"
				/>
				<span class="text-foreground/65 transition-colors group-hover:text-foreground/80"
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
					class="z-50 origin-(--bits-tooltip-content-transform-origin) animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
				>
					<div
						class="z-0 w-[290px] rounded-input border border-dark-10 bg-background p-3 shadow-popover outline-hidden"
					>
						<p class="text-sm font-semibold">{payload?.title ?? "Setup step"}</p>
						<p class="mt-1 text-xs leading-relaxed text-foreground/70">
							{payload?.description ??
								"Open a step manually to guide first-time users."}
						</p>
					</div>
				</Tooltip.Content>
			</Tooltip.Portal>
		{/snippet}
	</Tooltip.Root>
</Tooltip.Provider>
