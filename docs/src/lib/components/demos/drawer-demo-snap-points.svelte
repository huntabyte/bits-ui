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
		class="inline-flex h-12 items-center justify-center rounded-input bg-dark px-[21px] text-[15px] font-semibold text-background shadow-mini select-none hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
	>
		Open snap drawer
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:opacity-0 data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex touch-none items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
		>
			<Drawer.Popup
				class="relative flex max-h-[calc(100dvh-var(--top-margin))] min-h-0 w-full [transform:translateY(calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] touch-none flex-col overflow-visible rounded-t-2xl bg-drawer [padding-bottom:max(0px,calc(var(--drawer-snap-point-offset)+var(--drawer-swipe-movement-y)))] text-foreground shadow-drawer transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-[var(--bleed)] after:bg-drawer after:content-[''] data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[ending-style]:[padding-bottom:0] data-[ending-style]:shadow-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:[transform:translateY(calc(100%+2px))] data-[starting-style]:[padding-bottom:0] data-[starting-style]:shadow-none data-[swiping]:select-none"
				style={`--top-margin:${TOP_MARGIN_REM}rem`}
			>
				<div class="shrink-0 touch-none border-b border-border-card px-6 pt-3.5 pb-3">
					<div class="mx-auto h-1 w-12 rounded-full bg-dark-40"></div>
					<Drawer.Title class="mt-2.5 cursor-default text-center text-lg font-bold">
						Snap points
					</Drawer.Title>
				</div>
				<Drawer.Content
					class="min-h-0 flex-1 touch-auto overflow-y-auto overscroll-contain px-6 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
				>
					<div class="mx-auto w-full max-w-[350px]">
						<Drawer.Description class="mb-4 text-center text-base text-foreground-alt">
							Drag the sheet to snap between a compact peek and a near full-height
							view.
						</Drawer.Description>
						<div class="mb-6 grid gap-3" aria-hidden="true">
							{#each Array.from({ length: 20 }) as _, index (index)}
								<div class="h-12 rounded-xl bg-muted"></div>
							{/each}
						</div>
						<div class="flex items-center justify-end gap-4">
							<Drawer.Close
								class="inline-flex h-10 items-center justify-center rounded-input bg-muted px-[21px] text-[15px] font-medium shadow-mini select-none hover:bg-dark-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
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
