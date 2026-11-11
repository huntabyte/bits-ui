<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	const ACTIONS = ["Share", "Download", "Move to Folder", "Rename", "Duplicate"];
	let open = $state(false);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger
		class="inline-flex h-12 items-center justify-center rounded-input bg-dark px-[21px] text-[15px] font-semibold text-background shadow-mini select-none hover:bg-dark/95 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
	>
		File actions
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.4] [--bleed:3rem] data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:opacity-0 data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
		>
			<Drawer.Popup
				class="pointer-events-none box-border flex w-full max-w-[28rem] [transform:translateY(calc(var(--drawer-transition-slide-y,0px)+var(--drawer-swipe-movement-y)))] flex-col gap-3 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] outline-none focus-visible:outline-none data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:[transform:translateY(calc(100%+2px))] data-[swiping]:select-none"
			>
				<Drawer.Content
					class="pointer-events-auto overflow-hidden rounded-card bg-drawer text-foreground shadow-drawer"
				>
					<Drawer.Title class="sr-only">File actions</Drawer.Title>
					<Drawer.Description class="sr-only">
						Choose an action for this file.
					</Drawer.Description>

					<ul
						class="m-0 list-none divide-y divide-border-input p-0 dark:divide-border-card"
						aria-label="File actions"
					>
						{#each ACTIONS as action, index (index)}
							<li>
								{#if index === 0}
									<Drawer.Close class="sr-only">Close file actions</Drawer.Close>
								{/if}
								<button
									type="button"
									class="block w-full border-0 bg-transparent px-5 py-4 text-center text-[15px] text-foreground select-none hover:bg-dark-10 focus-visible:bg-dark-10 focus-visible:outline-none"
									onclick={() => (open = false)}
								>
									{action}
								</button>
							</li>
						{/each}
					</ul>
				</Drawer.Content>
				<div
					class="pointer-events-auto overflow-hidden rounded-card bg-drawer shadow-drawer"
				>
					<button
						type="button"
						class="block w-full border-0 bg-transparent px-5 py-4 text-center text-[15px] font-medium text-destructive select-none hover:bg-dark-10 focus-visible:bg-dark-10 focus-visible:outline-none"
						onclick={() => (open = false)}
					>
						Delete File
					</button>
				</div>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
