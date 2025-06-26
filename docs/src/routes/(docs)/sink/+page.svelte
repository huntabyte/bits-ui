<!--
	NOTE: Tailwind v4 does not support web container environments, so animations powered by tailwindcss-animate will not work in this environment.
-->
<script lang="ts">
	import { DropdownMenu } from "bits-ui";
	import CaretRight from "phosphor-svelte/lib/CaretRight";
	import DotsThree from "phosphor-svelte/lib/DotsThree";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-input text-foreground shadow-btn hover:bg-muted inline-flex h-10 w-10 select-none items-center justify-center rounded-full border text-sm font-medium active:scale-[0.98]"
	>
		<DotsThree class="text-foreground h-6 w-6" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="border-muted bg-background shadow-popover outline-hidden focus-visible:outline-hidden w-[229px] rounded-xl border px-1 py-1.5"
			sideOffset={8}
		>
			<DropdownMenu.Item
				onSelect={(e) => {
					// triggers
					console.log(e);
				}}
				class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
			>
				this triggers
			</DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger
					class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
				>
					<div class="flex items-center">nested</div>
					<div class="ml-auto flex items-center gap-px">
						<CaretRight class="text-foreground-alt size-5" />
					</div>
				</DropdownMenu.SubTrigger>
				<DropdownMenu.Portal>
					<DropdownMenu.SubContent
						class="border-muted bg-background shadow-popover ring-0! ring-transparent! w-[209px] rounded-xl border px-1 py-1.5 outline-none"
						sideOffset={10}
					>
						<DropdownMenu.Item
							onSelect={(e) => {
								// doesn't trigger
								console.log(e);
							}}
							class="rounded-button data-highlighted:bg-muted ring-0! ring-transparent! flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							doesn't trigger
						</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Portal>
			</DropdownMenu.Sub>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
