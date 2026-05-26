<script lang="ts">
	import { unstable_Drawer as Drawer, type DrawerSnapPoint } from "bits-ui";

	const TOP_MARGIN_REM = 1;
	const VISIBLE_SNAP_POINTS_REM = [30];

	function toViewportSnapPoint(heightRem: number) {
		return `${heightRem + TOP_MARGIN_REM}rem`;
	}

	const snapPoints: DrawerSnapPoint[] = [...VISIBLE_SNAP_POINTS_REM.map(toViewportSnapPoint), 1];
</script>

<Drawer.Root {snapPoints}>
	<Drawer.Trigger
		class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-12 select-none items-center justify-center px-[21px] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		Open snap drawer
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex touch-none items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
		>
			<Drawer.Popup
				class="bg-drawer text-foreground shadow-drawer after:bg-drawer relative flex max-h-[calc(100dvh-var(--top-margin))] min-h-0 w-full touch-none flex-col overflow-visible rounded-t-2xl transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] [padding-bottom:max(0px,calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] [transform:translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-[var(--bleed)] after:content-[''] data-[swiping]:select-none data-[ending-style]:shadow-none data-[starting-style]:shadow-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[padding-bottom:0] data-[starting-style]:[padding-bottom:0] data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[starting-style]:[transform:translateY(calc(100%+2px))]"
				style={`--top-margin:${TOP_MARGIN_REM}rem`}
			>
				<div class="border-border-card shrink-0 touch-none border-b px-6 pb-3 pt-3.5">
					<div class="bg-dark-40 mx-auto h-1 w-12 rounded-full"></div>
					<Drawer.Title class="mt-2.5 cursor-default text-center text-lg font-bold">
						Snap points
					</Drawer.Title>
				</div>
				<Drawer.Content
					class="min-h-0 flex-1 touch-auto overflow-y-auto overscroll-contain px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-4"
				>
					<div class="mx-auto w-full max-w-[350px]">
						<Drawer.Description class="text-foreground-alt mb-4 text-center text-base">
							Drag the sheet to snap between a compact peek and a near full-height
							view.
						</Drawer.Description>
						<div class="mb-6 grid gap-3" aria-hidden="true">
							{#each Array.from({ length: 20 }) as _, index (index)}
								<div class="bg-muted h-12 rounded-xl"></div>
							{/each}
						</div>
						<div class="flex items-center justify-end gap-4">
							<Drawer.Close
								class="rounded-input bg-muted shadow-mini hover:bg-dark-10 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-10 select-none items-center justify-center px-[21px] text-[15px] font-medium focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
							>
								Close
							</Drawer.Close>
						</div>
					</div>
				</Drawer.Content>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
