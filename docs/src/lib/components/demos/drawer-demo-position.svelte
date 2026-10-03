<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	const NOTIFICATIONS = [
		{ title: "Order shipped", desc: "Your order #4821 is on its way.", time: "2m ago" },
		{ title: "New comment", desc: "Alex replied to your review.", time: "15m ago" },
		{ title: "Welcome bonus", desc: "You earned 500 reward points.", time: "1h ago" },
	];
</script>

<Drawer.Root>
	<Drawer.Trigger
		class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-12 select-none items-center justify-center px-[21px] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		Notifications
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
		>
			<Drawer.Popup
				class="bg-drawer text-foreground shadow-drawer -mb-[3rem] max-h-[calc(80vh+3rem)] w-full touch-auto overflow-y-auto overscroll-contain rounded-t-2xl px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] pt-4 transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [transform:translateY(calc(var(--drawer-transition-slide-y,0px)+var(--drawer-swipe-movement-y)))] data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[starting-style]:[transform:translateY(calc(100%+2px))]"
			>
				<div class="bg-dark-40 mx-auto mb-4 h-1 w-12 rounded-full"></div>
				<Drawer.Content class="mx-auto w-full max-w-[32rem]">
					<Drawer.Title class="mb-1 text-center text-lg font-semibold tracking-tight">
						Notifications
					</Drawer.Title>
					<Drawer.Description class="text-foreground-alt mb-5 text-center text-sm">
						You have {NOTIFICATIONS.length} new updates.
					</Drawer.Description>

					<ul class="mb-6 space-y-1">
						{#each NOTIFICATIONS as n (n.title)}
							<li class="rounded-card-sm bg-muted flex items-start gap-3 px-3 py-3">
								<div class="min-w-0 flex-1">
									<p class="text-sm font-medium">{n.title}</p>
									<p class="text-foreground-alt mt-0.5 text-xs">{n.desc}</p>
								</div>
								<span class="text-muted-foreground shrink-0 pt-0.5 text-xs">
									{n.time}
								</span>
							</li>
						{/each}
					</ul>

					<div class="flex justify-center">
						<Drawer.Close
							class="rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-10 select-none items-center justify-center px-[21px] text-[15px] font-medium focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
						>
							Dismiss
						</Drawer.Close>
					</div>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
