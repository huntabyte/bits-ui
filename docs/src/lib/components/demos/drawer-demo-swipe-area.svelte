<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	let portalContainer = $state<HTMLDivElement | null>(null);
</script>

<div
	bind:this={portalContainer}
	class="rounded-card-sm bg-background text-foreground relative min-h-[320px] w-full overflow-hidden"
>
	<Drawer.Root swipeDirection="right">
		<Drawer.SwipeArea
			class="border-foreground/20 bg-dark-04 absolute inset-y-0 right-0 z-10 box-border w-10 border-l-2 border-dashed"
		>
			<span
				class="text-muted-foreground pointer-events-none absolute right-0 top-1/2 mr-2 origin-center -translate-y-1/2 -rotate-90 whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em]"
			>
				Swipe here
			</span>
		</Drawer.SwipeArea>
		<div class="flex min-h-[320px] flex-col items-center justify-center gap-3 px-4 text-center">
			<p class="text-foreground-alt pr-12 text-center text-sm">
				Swipe from the right edge to open the drawer.
			</p>
		</div>
		{#if portalContainer}
			<Drawer.Portal to={portalContainer}>
				<Drawer.Backdrop
					class="absolute inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
				/>
				<Drawer.Viewport
					class="absolute inset-0 z-20 flex items-stretch justify-end p-[var(--viewport-padding)] [--viewport-padding:0px] [padding-bottom:calc(var(--viewport-padding)+var(--drawer-keyboard-inset))] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]"
				>
					<Drawer.Popup
						trapFocus={false}
						preventScroll={false}
						class="bg-drawer text-foreground shadow-drawer -mr-[3rem] h-full w-[calc(20rem+3rem)] max-w-[calc(100vw-3rem+3rem)] touch-auto overflow-y-auto p-6 pr-[calc(1.5rem+3rem)] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] [transform:translateX(var(--drawer-swipe-movement-x))] data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]"
					>
						<Drawer.Content class="mx-auto w-full max-w-[32rem]">
							<Drawer.Title class="-mt-1.5 mb-1 text-lg font-semibold tracking-tight">
								Drawer
							</Drawer.Title>
							<Drawer.Description class="text-foreground-alt mb-6 text-sm">
								Opened via swipe gesture from the edge.
							</Drawer.Description>
							<div class="flex justify-end">
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
