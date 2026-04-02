<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	function preventClose(event: Event) {
		event.preventDefault();
	}
</script>

<Drawer.Root swipeDirection="right">
	<Drawer.Trigger
		class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-12 select-none items-center justify-center px-[21px] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		Open panel
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Viewport
			class="pointer-events-none fixed inset-0 z-[60] flex items-stretch justify-end p-[var(--viewport-padding)] [--viewport-padding:0px] [padding-bottom:calc(var(--viewport-padding)+var(--drawer-keyboard-inset))] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]"
		>
			<Drawer.Popup
				trapFocus={false}
				preventScroll={false}
				onInteractOutside={preventClose}
				class="bg-drawer text-foreground shadow-drawer pointer-events-auto -mr-[3rem] h-full w-[calc(20rem+3rem)] max-w-[calc(100vw-3rem+3rem)] touch-auto overflow-hidden pr-[calc(1.5rem+3rem)] transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] [transform:translateX(var(--drawer-swipe-movement-x))] data-[swiping]:select-none data-[ending-style]:shadow-none data-[starting-style]:shadow-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]"
			>
				<Drawer.Content class="flex h-full w-full flex-col p-5">
					<Drawer.Title class="text-base font-semibold tracking-tight">
						Notes
					</Drawer.Title>
					<Drawer.Description class="text-foreground-alt mb-4 text-xs">
						Stays open while you browse the page.
					</Drawer.Description>

					<ul class="flex-1 space-y-2 overflow-y-auto">
						<li class="rounded-card-sm bg-muted px-3 py-2.5">
							<p class="text-sm font-medium">API rate limits</p>
							<p class="text-foreground-alt mt-0.5 text-xs">
								Max 1000 req/min per key
							</p>
						</li>
						<li class="rounded-card-sm bg-muted px-3 py-2.5">
							<p class="text-sm font-medium">Deploy checklist</p>
							<p class="text-foreground-alt mt-0.5 text-xs">
								Run migrations before release
							</p>
						</li>
						<li class="rounded-card-sm bg-muted px-3 py-2.5">
							<p class="text-sm font-medium">Design feedback</p>
							<p class="text-foreground-alt mt-0.5 text-xs">
								Increase contrast on nav links
							</p>
						</li>
					</ul>

					<div class="mt-3 flex justify-end">
						<Drawer.Close
							class="rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-10 shrink-0 select-none items-center justify-center px-[21px] text-[15px] font-medium focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
						>
							Close
						</Drawer.Close>
					</div>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
