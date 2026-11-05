<script lang="ts">
	import { Popover, Separator, Toggle } from "bits-ui";
	import ImageSquare from "phosphor-svelte/lib/ImageSquare";
	import LinkSimpleHorizontalBreak from "phosphor-svelte/lib/LinkSimpleHorizontalBreak";
	import { fly } from "svelte/transition";

	let width = $state(1024);
	let height = $state(768);
</script>

<Popover.Root>
	<Popover.Trigger
		class="inline-flex h-10
	items-center justify-center rounded-input bg-dark px-[21px] text-[15px] font-medium whitespace-nowrap text-background shadow-mini transition-all select-none hover:cursor-pointer hover:bg-dark/95 active:scale-[0.98]"
	>
		Resize
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="z-50 w-full max-w-[328px] rounded-[12px] border border-dark-10 bg-background p-4 shadow-popover"
			sideOffset={8}
			forceMount
		>
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly={{ duration: 300 }}>
							<div class="flex items-center">
								<div
									class="mr-3 flex size-12 items-center justify-center rounded-full bg-muted"
								>
									<ImageSquare class="size-6" />
								</div>
								<div class="flex flex-col">
									<h4
										class="text-[17px] leading-5 font-semibold tracking-[-0.01em]"
									>
										Resize image
									</h4>
									<p class="text-sm font-medium text-muted-foreground">
										Resize your photos easily
									</p>
								</div>
							</div>
							<Separator.Root class="-mx-4 mt-[17px] mb-6 block h-px bg-dark-10" />
							<div class="flex items-center pb-2">
								<div class="mr-2 flex items-center">
									<div class="relative mr-2">
										<span class="sr-only">Width</span>
										<span
											aria-hidden="true"
											class="absolute top-4 left-5 text-xxs text-muted-foreground"
											>W</span
										>
										<input
											type="number"
											class="h-input w-[119px] rounded-10px border border-border-input bg-background pr-2 pl-10 text-base text-foreground sm:text-sm"
											bind:value={width}
										/>
									</div>
									<div class="relative">
										<span class="sr-only">Height</span>
										<span
											aria-hidden="true"
											class="absolute top-4 left-5 text-xxs text-muted-foreground"
											>H</span
										>
										<input
											type="number"
											class="h-input w-[119px] rounded-10px border border-border-input bg-background pr-2 pl-10 text-base text-foreground sm:text-sm"
											bind:value={height}
										/>
									</div>
								</div>
								<Toggle.Root
									aria-label="toggle constrain portions"
									class="inline-flex size-10 items-center justify-center rounded-[9px] bg-background transition-all hover:bg-muted active:scale-[0.98] data-[state=on]:bg-muted"
								>
									<LinkSimpleHorizontalBreak class="size-6" />
								</Toggle.Root>
							</div>
						</div>
					</div>
				{/if}
			{/snippet}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
