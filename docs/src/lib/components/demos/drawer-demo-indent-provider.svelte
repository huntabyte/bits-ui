<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	let portalContainer = $state<HTMLDivElement | null>(null);
</script>

<Drawer.Provider>
	<div bind:this={portalContainer} class="relative w-full overflow-hidden [--bleed:3rem]">
		<Drawer.IndentBackground class="dark:bg-dark-40 absolute inset-0 bg-black" />
		<Drawer.Indent
			class="border-border-input bg-background text-foreground relative min-h-[320px] origin-[center_top] border p-4 will-change-transform [--indent-progress:var(--drawer-swipe-progress)] [--indent-radius:calc(1rem*(1-var(--indent-progress)))] [--indent-transition:calc(1-clamp(0,calc(var(--drawer-swipe-progress)*100000),1))] [transform:scale(1)_translateY(0)] [transition-duration:calc(400ms*var(--indent-transition)),calc(250ms*var(--indent-transition))] [transition:transform_0.4s_cubic-bezier(0.32,0.72,0,1),border-radius_0.25s_cubic-bezier(0.32,0.72,0,1)] data-[active]:[border-top-left-radius:var(--indent-radius)] data-[active]:[border-top-right-radius:var(--indent-radius)] data-[active]:[transform:scale(calc(0.98+(0.02*var(--indent-progress))))_translateY(calc(0.5rem*(1-var(--indent-progress))))]"
		>
			<div class="flex min-h-[320px] flex-col items-center justify-center gap-3">
				<p class="text-foreground-alt text-sm">Open the drawer to see the indent effect.</p>
				<Drawer.Root>
					<Drawer.Trigger
						class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-10 select-none items-center justify-center px-[21px] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
					>
						Open drawer
					</Drawer.Trigger>
					{#if portalContainer}
						<Drawer.Portal to={portalContainer}>
							<Drawer.Backdrop
								class="absolute inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
							/>
							<Drawer.Viewport
								class="absolute inset-0 flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
							>
								<Drawer.Popup
									trapFocus={false}
									preventScroll={false}
									class="bg-drawer text-foreground shadow-drawer -mb-[var(--bleed)] box-border max-h-[calc(80vh+var(--bleed))] w-full overflow-y-auto overscroll-contain rounded-t-2xl px-6 py-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+var(--bleed))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [transform:translateY(calc(var(--drawer-transition-slide-y,0px)+var(--drawer-swipe-movement-y)))] data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[starting-style]:[transform:translateY(calc(100%+2px))]"
								>
									<div
										class="bg-dark-40 mx-auto mb-4 h-1 w-12 rounded-full"
									></div>
									<Drawer.Content class="mx-auto w-full max-w-[32rem]">
										<Drawer.Title
											class="mb-1 mt-0 text-center text-lg font-semibold leading-7 tracking-tight"
										>
											Drawer with Indent
										</Drawer.Title>
										<Drawer.Description
											class="text-foreground-alt mb-5 text-center text-sm"
										>
											The background scales and rounds as this opens.
										</Drawer.Description>

										<div class="flex justify-center">
											<Drawer.Close
												class="rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-10 select-none items-center justify-center px-[21px] text-[15px] font-medium focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
											>
												Close
											</Drawer.Close>
										</div>
									</Drawer.Content>
								</Drawer.Popup>
							</Drawer.Viewport>
						</Drawer.Portal>
					{/if}
				</Drawer.Root>
			</div>
		</Drawer.Indent>
	</div>
</Drawer.Provider>
