<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";
</script>

<Drawer.Root swipeDirection="right">
	<Drawer.Trigger
		class="inline-flex h-12 items-center justify-center rounded-input bg-dark px-[21px] text-[15px] font-semibold text-background shadow-mini select-none hover:bg-dark/95 active:scale-[0.98]"
	>
		Compose
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
				<Drawer.Content class="mx-auto flex h-full w-full max-w-[32rem] flex-col">
					<Drawer.Title
						class="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase"
					>
						Compose
					</Drawer.Title>
					<Drawer.Description class="mb-5 text-sm text-foreground-alt">
						Quick input-focused drawer for iOS keyboard testing.
					</Drawer.Description>

					<div class="mb-4 space-y-2">
						<label
							for="drawer-note-subject"
							class="text-sm font-medium text-foreground"
						>
							Subject
						</label>
						<input
							id="drawer-note-subject"
							type="text"
							placeholder="Type here..."
							class="h-10 w-full rounded-input border border-border-input bg-background px-3 text-sm text-foreground outline-none placeholder:text-foreground-alt"
						/>
					</div>

					<div class="mb-6 space-y-2">
						<label for="drawer-note-tags" class="text-sm font-medium text-foreground"
							>Tags</label
						>
						<input
							id="drawer-note-tags"
							type="text"
							placeholder="work, urgent"
							class="h-10 w-full rounded-input border border-border-input bg-background px-3 text-sm text-foreground outline-none placeholder:text-foreground-alt"
						/>
					</div>

					<div class="mt-auto flex justify-end">
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
