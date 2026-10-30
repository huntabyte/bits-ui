<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";
</script>

<Drawer.Root swipeDirection="right">
	<Drawer.Trigger
		class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 inline-flex h-12 select-none items-center justify-center px-[21px] text-[15px] font-semibold active:scale-[0.98]"
	>
		Now Playing
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
					<Drawer.Title
						class="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-widest"
					>
						Now Playing
					</Drawer.Title>

					<div class="mb-5 flex items-start gap-4">
						<div class="rounded-10px bg-dark-10 size-14 shrink-0"></div>
						<div class="min-w-0 flex-1 pt-0.5">
							<Drawer.Description class="min-w-0 flex-1 pt-0.5">
								<span class="truncate text-base font-semibold tracking-tight">
									Mr. Brightside
								</span>
								<span class="text-foreground-alt truncate text-sm">
									The Killers — Hot Fuss
								</span>
							</Drawer.Description>
						</div>
						<span class="text-muted-foreground shrink-0 pt-1 text-xs tabular-nums">
							3:42
						</span>
					</div>

					<p
						class="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-widest"
					>
						Up Next
					</p>
					<ul class="mb-6">
						<li
							class="border-border-card flex items-center gap-3 border-b py-2.5 text-sm"
						>
							<span
								class="text-muted-foreground w-4 shrink-0 text-right tabular-nums"
							>
								1
							</span>
							<span class="flex-1 truncate">Your Love</span>
							<span class="text-foreground-alt shrink-0 text-xs">The Outfield</span>
						</li>
						<li
							class="border-border-card flex items-center gap-3 border-b py-2.5 text-sm"
						>
							<span
								class="text-muted-foreground w-4 shrink-0 text-right tabular-nums"
							>
								2
							</span>
							<span class="flex-1 truncate">Iris</span>
							<span class="text-foreground-alt shrink-0 text-xs">Goo Goo Dolls</span>
						</li>
						<li
							class="border-border-card flex items-center gap-3 border-b py-2.5 text-sm"
						>
							<span
								class="text-muted-foreground w-4 shrink-0 text-right tabular-nums"
							>
								3
							</span>
							<span class="flex-1 truncate">Electric Feel</span>
							<span class="text-foreground-alt shrink-0 text-xs">MGMT</span>
						</li>
						<li class="flex items-center gap-3 py-2.5 text-sm">
							<span
								class="text-muted-foreground w-4 shrink-0 text-right tabular-nums"
							>
								4
							</span>
							<span class="flex-1 truncate">Somebody Told Me</span>
							<span class="text-foreground-alt shrink-0 text-xs">The Killers</span>
						</li>
					</ul>

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
</Drawer.Root>
