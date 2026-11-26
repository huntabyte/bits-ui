<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	let portalContainer = $state<HTMLDivElement | null>(null);
</script>

<div
	bind:this={portalContainer}
	class="relative min-h-[320px] w-full overflow-hidden rounded-card-sm bg-background text-foreground"
>
	<Drawer.Root swipeDirection="right">
		<Drawer.SwipeArea
			class="absolute inset-y-0 right-0 z-10 box-border w-10 border-l-2 border-dashed border-foreground/20 bg-dark-04"
		>
			<span
				class="pointer-events-none absolute top-1/2 right-0 mr-2 origin-center -translate-y-1/2 -rotate-90 text-xs font-medium tracking-[0.12em] whitespace-nowrap text-muted-foreground uppercase"
			>
				Swipe here
			</span>
		</Drawer.SwipeArea>
		<div class="flex min-h-[320px] flex-col items-center justify-center gap-3 px-4 text-center">
			<p class="pr-12 text-center text-sm text-foreground-alt">
				Swipe from the right edge to open the drawer.
			</p>
		</div>
		{#if portalContainer}
			<Drawer.Portal to={portalContainer}>
				<Drawer.Backdrop
					class="absolute inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:opacity-0 data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
				/>
				<Drawer.Viewport
					class="absolute inset-0 z-20 flex items-stretch justify-end p-[var(--viewport-padding)] [padding-bottom:calc(var(--viewport-padding)+var(--drawer-keyboard-inset))] [--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]"
				>
					<Drawer.Popup
						trapFocus={false}
						preventScroll={false}
						class="-mr-[3rem] h-full w-[calc(20rem+3rem)] max-w-[calc(100vw-3rem+3rem)] [transform:translateX(var(--drawer-swipe-movement-x))] touch-auto overflow-y-auto bg-drawer p-6 pr-[calc(1.5rem+3rem)] text-foreground shadow-drawer transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[swiping]:select-none supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]"
					>
						<Drawer.Content class="mx-auto w-full max-w-[32rem]">
							<Drawer.Title class="-mt-1.5 mb-1 text-lg font-semibold tracking-tight">
								Drawer
							</Drawer.Title>
							<Drawer.Description class="mb-6 text-sm text-foreground-alt">
								Opened via swipe gesture from the edge.
							</Drawer.Description>
							<div class="flex justify-end">
								<Drawer.Close
									class="inline-flex h-10 items-center justify-center rounded-input bg-muted px-[21px] text-[15px] font-medium shadow-mini select-none hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
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
