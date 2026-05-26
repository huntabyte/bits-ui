<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	const rows = Array.from({ length: 30 }, (_, i) => `Scrollable item ${i + 1}`);
</script>

<Drawer.Root swipeDirection="right">
	<Drawer.Trigger
		class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-12 select-none items-center justify-center px-[21px] text-[15px] font-semibold active:scale-[0.98]"
	>
		Long scroll test
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex items-stretch justify-end p-[var(--viewport-padding)] [--viewport-padding:0px] [padding-bottom:calc(var(--viewport-padding)+var(--drawer-keyboard-inset))] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]"
		>
			<Drawer.Popup
				class="bg-drawer text-foreground shadow-drawer -mr-[3rem] h-full w-[calc(20rem+3rem)] max-w-[calc(100vw-3rem+3rem)] touch-auto overflow-y-auto overscroll-contain p-6 pr-[calc(1.5rem+3rem)] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] [transform:translateX(var(--drawer-swipe-movement-x))] data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]"
			>
				<Drawer.Content class="mx-auto w-full max-w-[32rem]">
					<div class="mb-4 flex items-start justify-between gap-3">
						<div>
							<Drawer.Title
								class="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-widest"
							>
								Overflow Scroll
							</Drawer.Title>
							<Drawer.Description class="text-foreground-alt text-sm">
								Scroll to the bottom input and focus it.
							</Drawer.Description>
						</div>
						<Drawer.Close
							class="rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-10 shrink-0 select-none items-center justify-center px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
						>
							Close
						</Drawer.Close>
					</div>

					<ul class="space-y-2">
						{#each rows as row (row)}
							<li class="rounded-card-sm bg-muted px-3 py-2.5 text-sm">{row}</li>
						{/each}
					</ul>

					<div class="border-border-card mt-4 border-t pt-4">
						<label
							for="drawer-bottom-input"
							class="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-widest"
						>
							Bottom Input
						</label>
						<input
							id="drawer-bottom-input"
							type="text"
							placeholder="Focus me at the very bottom"
							class="border-border-input bg-background rounded-input text-foreground placeholder:text-foreground-alt h-10 w-full border px-3 text-sm outline-none"
						/>
					</div>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
