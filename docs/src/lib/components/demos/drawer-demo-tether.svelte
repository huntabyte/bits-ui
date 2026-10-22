<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	type QueuePayload = {
		title: string;
		description: string;
	};

	const queueTether = Drawer.createTether<QueuePayload>();
</script>

<div class="mx-auto grid w-full max-w-[760px] gap-2 sm:grid-cols-2">
	<div
		class="rounded-10px border-border bg-background-alt shadow-mini flex items-center justify-between border p-3"
	>
		<div>
			<p class="text-sm font-semibold">Exports</p>
			<p class="text-foreground/60 mt-0.5 text-xs">Download or share generated files</p>
		</div>
		<Drawer.Trigger
			tether={queueTether}
			payload={{
				title: "Export CSV",
				description: "Includes visible columns and filters applied to this view.",
			}}
			class="rounded-9px bg-background text-foreground/80 ring-dark ring-offset-background shadow-mini hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden active:bg-dark-10 inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
		>
			Export
		</Drawer.Trigger>
	</div>

	<div
		class="rounded-10px border-border bg-background-alt shadow-mini flex items-center justify-between border p-3"
	>
		<div>
			<p class="text-sm font-semibold">Sharing</p>
			<p class="text-foreground/60 mt-0.5 text-xs">Send a snapshot to collaborators</p>
		</div>
		<Drawer.Trigger
			tether={queueTether}
			payload={{
				title: "Share link",
				description: "Creates a read-only link with the current filters and date range.",
			}}
			class="rounded-9px bg-background text-foreground/80 ring-dark ring-offset-background shadow-mini hover:bg-muted focus-visible:ring-dark focus-visible:ring-offset-background focus-visible:outline-hidden active:bg-dark-10 inline-flex h-8 shrink-0 items-center justify-center px-3 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
		>
			Share
		</Drawer.Trigger>
	</div>
</div>

<Drawer.Root tether={queueTether} swipeDirection="down">
	{#snippet children({ payload })}
		<Drawer.Portal>
			<Drawer.Backdrop
				class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
			/>
			<Drawer.Viewport
				class="fixed inset-0 z-[60] flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
			>
				<Drawer.Popup
					class="bg-drawer text-foreground shadow-drawer -mb-[3rem] max-h-[calc(80vh+3rem)] w-full max-w-[min(32rem,calc(100vw-1.5rem))] touch-auto overflow-y-auto overscroll-contain rounded-t-2xl px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] pt-4 transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [transform:translateY(calc(var(--drawer-transition-slide-y,0px)+var(--drawer-swipe-movement-y)))] data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[starting-style]:[transform:translateY(calc(100%+2px))]"
				>
					<div class="bg-dark-40 mx-auto mb-4 h-1 w-12 rounded-full"></div>
					<Drawer.Content class="mx-auto w-full max-w-[32rem]">
						<Drawer.Title class="text-lg font-semibold tracking-tight">
							{payload?.title ?? "Action"}
						</Drawer.Title>
						<Drawer.Description class="text-foreground-alt mt-1 text-sm">
							{payload?.description ?? ""}
						</Drawer.Description>
						<div class="mt-6 flex justify-end">
							<Drawer.Close
								class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-10 select-none items-center justify-center px-4 text-sm font-medium active:scale-[0.98]"
							>
								Done
							</Drawer.Close>
						</div>
					</Drawer.Content>
				</Drawer.Popup>
			</Drawer.Viewport>
		</Drawer.Portal>
	{/snippet}
</Drawer.Root>
