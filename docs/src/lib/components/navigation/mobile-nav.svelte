<script lang="ts">
	import MobileLink from "./mobile-link.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { navigation } from "$lib/config/index.js";
	import { Popover } from "bits-ui";
	import ScrollArea from "$lib/components/ui/scroll-area.svelte";
	import { page } from "$app/state";
	import MobileMenuIcon from "./mobile-menu-icon.svelte";

	let open = $state(false);
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				class="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden [&_svg]:size-6"
			>
				<MobileMenuIcon {open} />
				<span class="sr-only">Toggle menu</span>
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="bg-background/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 h-(--bits-popover-content-available-height) w-(--bits-popover-content-available-width) origin-(--bits-popover-content-transform-origin) pr-0 backdrop-blur"
			align="start"
			side="bottom"
			alignOffset={-16}
			sideOffset={14}
			preventScroll
			trapFocus={false}
		>
			<ScrollArea
				class="h-(--bits-popover-content-available-height) w-(--bits-popover-content-available-width) mt-2 max-h-none max-w-none"
			>
				<div class="flex flex-col gap-2">
					{#each navigation.sidebar as navItem, index (index)}
						<div class="flex flex-col pt-3" data-index={index}>
							<h4
								class="text-muted-foreground mb-2 px-5 text-sm font-medium uppercase"
							>
								{navItem.title}
							</h4>
							<div class="flex flex-col">
								{#if navItem.title === "Overview"}
									<MobileLink
										href="/"
										data-active={page.url.pathname === "/"}
										onClose={() => (open = false)}
										class="text-foreground/95 dark:data-[active=true]:text-accent px-5 py-1.5 text-[22px] font-normal data-[active=true]:font-semibold dark:font-medium dark:data-[active=true]:font-medium"
									>
										Home
									</MobileLink>
								{/if}
								{#if navItem?.items?.length}
									{#each navItem.items as item (item.title + item.href)}
										{#if !item.disabled && item.href}
											<MobileLink
												href={item.href}
												data-active={item.href === page.url.pathname}
												onClose={() => (open = false)}
												class="text-foreground/95 dark:data-[active=true]:text-accent px-5 py-1.5 text-[22px] font-normal data-[active=true]:font-semibold dark:font-medium dark:data-[active=true]:font-medium"
											>
												{item.title}
											</MobileLink>
										{/if}
									{/each}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</ScrollArea>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
