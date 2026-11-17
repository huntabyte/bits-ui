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
		class="flex items-center justify-between rounded-10px border border-border bg-background-alt p-3 shadow-mini"
	>
		<div>
			<p class="text-sm font-semibold">Exports</p>
			<p class="mt-0.5 text-xs text-foreground/60">Download or share generated files</p>
		</div>
		<Drawer.Trigger
			tether={queueTether}
			payload={{
				title: "Export CSV",
				description: "Includes visible columns and filters applied to this view.",
			}}
			class="inline-flex h-8 shrink-0 items-center justify-center rounded-9px bg-background px-3 text-xs font-medium text-foreground/80 shadow-mini ring-dark ring-offset-background transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98] active:bg-dark-10"
		>
			Export
		</Drawer.Trigger>
	</div>

	<div
		class="flex items-center justify-between rounded-10px border border-border bg-background-alt p-3 shadow-mini"
	>
		<div>
			<p class="text-sm font-semibold">Sharing</p>
			<p class="mt-0.5 text-xs text-foreground/60">Send a snapshot to collaborators</p>
		</div>
		<Drawer.Trigger
			tether={queueTether}
			payload={{
				title: "Share link",
				description: "Creates a read-only link with the current filters and date range.",
			}}
			class="inline-flex h-8 shrink-0 items-center justify-center rounded-9px bg-background px-3 text-xs font-medium text-foreground/80 shadow-mini ring-dark ring-offset-background transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-dark focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98] active:bg-dark-10"
		>
			Share
		</Drawer.Trigger>
	</div>
</div>

<Drawer.Root tether={queueTether} swipeDirection="down">
	{#snippet children({ payload })}
		<Drawer.Portal>
			<Drawer.Backdrop
				class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:opacity-0 data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
			/>
			<Drawer.Viewport
				class="fixed inset-0 z-[60] flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
			>
				<Drawer.Popup
					class="-mb-[3rem] max-h-[calc(80vh+3rem)] w-full max-w-[min(32rem,calc(100vw-1.5rem))] [transform:translateY(calc(var(--drawer-transition-slide-y,0px)+var(--drawer-swipe-movement-y)))] touch-auto overflow-y-auto overscroll-contain rounded-t-2xl bg-drawer px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] text-foreground shadow-drawer transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:[transform:translateY(calc(100%+2px))] data-[swiping]:select-none"
				>
					<div class="mx-auto mb-4 h-1 w-12 rounded-full bg-dark-40"></div>
					<Drawer.Content class="mx-auto w-full max-w-[32rem]">
						<Drawer.Title class="text-lg font-semibold tracking-tight">
							{payload?.title ?? "Action"}
						</Drawer.Title>
						<Drawer.Description class="mt-1 text-sm text-foreground-alt">
							{payload?.description ?? ""}
						</Drawer.Description>
						<div class="mt-6 flex justify-end">
							<Drawer.Close
								class="inline-flex h-10 items-center justify-center rounded-input bg-dark px-4 text-sm font-medium text-background shadow-mini select-none hover:bg-dark/95 active:scale-[0.98]"
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
