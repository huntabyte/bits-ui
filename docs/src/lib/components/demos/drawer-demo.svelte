<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";
</script>

<Drawer.Root swipeDirection="right">
	<Drawer.Trigger
		class="inline-flex h-12 items-center justify-center rounded-input bg-dark px-[21px] text-[15px] font-semibold text-background shadow-mini select-none hover:bg-dark/95 active:scale-[0.98]"
	>
		Now Playing
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:opacity-0 data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex items-stretch justify-end p-[var(--viewport-padding)] [padding-bottom:calc(var(--viewport-padding)+var(--drawer-keyboard-inset))] [--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]"
		>
			<Drawer.Popup
				class="-mr-[3rem] h-full w-[calc(20rem+3rem)] max-w-[calc(100vw-3rem+3rem)] [transform:translateX(var(--drawer-swipe-movement-x))] touch-auto overflow-y-auto overscroll-contain bg-drawer p-6 pr-[calc(1.5rem+3rem)] text-foreground shadow-drawer transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[swiping]:select-none supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]"
			>
				<Drawer.Content class="mx-auto w-full max-w-[32rem]">
					<Drawer.Title
						class="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase"
					>
						Now Playing
					</Drawer.Title>

					<div class="mb-5 flex items-start gap-4">
						<div class="size-14 shrink-0 rounded-10px bg-dark-10"></div>
						<div class="min-w-0 flex-1 pt-0.5">
							<Drawer.Description class="min-w-0 flex-1 pt-0.5">
								<span class="truncate text-base font-semibold tracking-tight">
									Mr. Brightside
								</span>
								<span class="truncate text-sm text-foreground-alt">
									The Killers — Hot Fuss
								</span>
							</Drawer.Description>
						</div>
						<span class="shrink-0 pt-1 text-xs text-muted-foreground tabular-nums">
							3:42
						</span>
					</div>

					<p
						class="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase"
					>
						Up Next
					</p>
					<ul class="mb-6">
						<li
							class="flex items-center gap-3 border-b border-border-card py-2.5 text-sm"
						>
							<span
								class="w-4 shrink-0 text-right text-muted-foreground tabular-nums"
							>
								1
							</span>
							<span class="flex-1 truncate">Your Love</span>
							<span class="shrink-0 text-xs text-foreground-alt">The Outfield</span>
						</li>
						<li
							class="flex items-center gap-3 border-b border-border-card py-2.5 text-sm"
						>
							<span
								class="w-4 shrink-0 text-right text-muted-foreground tabular-nums"
							>
								2
							</span>
							<span class="flex-1 truncate">Iris</span>
							<span class="shrink-0 text-xs text-foreground-alt">Goo Goo Dolls</span>
						</li>
						<li
							class="flex items-center gap-3 border-b border-border-card py-2.5 text-sm"
						>
							<span
								class="w-4 shrink-0 text-right text-muted-foreground tabular-nums"
							>
								3
							</span>
							<span class="flex-1 truncate">Electric Feel</span>
							<span class="shrink-0 text-xs text-foreground-alt">MGMT</span>
						</li>
						<li class="flex items-center gap-3 py-2.5 text-sm">
							<span
								class="w-4 shrink-0 text-right text-muted-foreground tabular-nums"
							>
								4
							</span>
							<span class="flex-1 truncate">Somebody Told Me</span>
							<span class="shrink-0 text-xs text-foreground-alt">The Killers</span>
						</li>
					</ul>

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
</Drawer.Root>
