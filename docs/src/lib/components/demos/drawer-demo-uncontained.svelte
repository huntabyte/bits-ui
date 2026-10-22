<script lang="ts">
	import { unstable_Drawer as Drawer } from "bits-ui";

	const ACTIONS = ["Share", "Download", "Move to Folder", "Rename", "Duplicate"];
	let open = $state(false);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger
		class="rounded-input bg-dark text-background shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden inline-flex h-12 select-none items-center justify-center px-[21px] text-[15px] font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
	>
		File actions
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Backdrop
			class="fixed inset-0 z-[60] min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress))*var(--drawer-backdrop-interpolate,1))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.4] [--bleed:3rem] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[swiping]:duration-0 dark:[--backdrop-opacity:0.7]"
		/>
		<Drawer.Viewport
			class="fixed inset-0 z-[60] flex items-end justify-center [padding-bottom:var(--drawer-keyboard-inset)]"
		>
			<Drawer.Popup
				class="pointer-events-none box-border flex w-full max-w-[28rem] flex-col gap-3 px-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] outline-none transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] [transform:translateY(calc(var(--drawer-transition-slide-y,0px)+var(--drawer-swipe-movement-y)))] focus-visible:outline-none data-[swiping]:select-none data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[ending-style]:[transform:translateY(calc(100%+2px))] data-[starting-style]:[transform:translateY(calc(100%+2px))]"
			>
				<Drawer.Content
					class="rounded-card bg-drawer text-foreground shadow-drawer pointer-events-auto overflow-hidden"
				>
					<Drawer.Title class="sr-only">File actions</Drawer.Title>
					<Drawer.Description class="sr-only">
						Choose an action for this file.
					</Drawer.Description>

					<ul
						class="divide-border-input dark:divide-border-card m-0 list-none divide-y p-0"
						aria-label="File actions"
					>
						{#each ACTIONS as action, index (index)}
							<li>
								{#if index === 0}
									<Drawer.Close class="sr-only">Close file actions</Drawer.Close>
								{/if}
								<button
									type="button"
									class="text-foreground hover:bg-dark-10 focus-visible:bg-dark-10 block w-full select-none border-0 bg-transparent px-5 py-4 text-center text-[15px] focus-visible:outline-none"
									onclick={() => (open = false)}
								>
									{action}
								</button>
							</li>
						{/each}
					</ul>
				</Drawer.Content>
				<div
					class="rounded-card bg-drawer shadow-drawer pointer-events-auto overflow-hidden"
				>
					<button
						type="button"
						class="text-destructive hover:bg-dark-10 focus-visible:bg-dark-10 block w-full select-none border-0 bg-transparent px-5 py-4 text-center text-[15px] font-medium focus-visible:outline-none"
						onclick={() => (open = false)}
					>
						Delete File
					</button>
				</div>
			</Drawer.Popup>
		</Drawer.Viewport>
	</Drawer.Portal>
</Drawer.Root>
