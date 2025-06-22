<script lang="ts">
	import { Tabs } from "bits-ui";
	import Airplane from "phosphor-svelte/lib/Airplane";
</script>

<div class="pt-6">
	<Tabs.Root
		value="outbound"
		class="rounded-card border-muted bg-background-alt shadow-card w-[390px] border p-3"
	>
		<Tabs.List
			class="rounded-9px bg-dark-10 shadow-mini-inset dark:bg-background grid w-full grid-cols-2 gap-1 p-1 text-sm font-semibold leading-[0.01em] dark:border dark:border-neutral-600/30"
		>
			<Tabs.Trigger
				value="outbound"
				class="data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white"
				>Outbound</Tabs.Trigger
			>
			<Tabs.Trigger
				value="inbound"
				class="data-[state=active]:shadow-mini dark:data-[state=active]:bg-muted h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white"
				>Inbound</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="outbound" class="select-none pt-3">
			<div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
				<div class="text-left">
					<h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">
						Prague
					</h4>
					<p class="text-muted-foreground text-sm font-medium">06:05</p>
				</div>
				<div class="self-end text-center">
					<p class="text-muted-foreground text-sm font-medium">3h 30m</p>
				</div>
				<div class="text-right">
					<h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">
						Malaga
					</h4>
					<p class="text-muted-foreground text-sm font-medium">06:05</p>
				</div>
				<div class="relative col-span-3">
					<hr class="border-border-input border-1 relative top-4 h-px border-dashed" />

					<div class="bg-background-alt absolute left-1/2 -translate-x-1/2 p-1">
						<Airplane class="text-muted-foreground size-6 rotate-90" />
					</div>
				</div>
			</div>
		</Tabs.Content>
		<Tabs.Content value="inbound" class="select-none pt-3">
			<div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
				<div class="text-left">
					<h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">
						Malaga
					</h4>
					<p class="text-muted-foreground text-sm font-medium">07:25</p>
				</div>
				<div class="self-end text-center">
					<p class="text-muted-foreground text-sm font-medium">3h 20m</p>
				</div>
				<div class="text-right">
					<h4 class="mb-2 text-[20px] font-semibold leading-none tracking-[-0.01em]">
						Prague
					</h4>
					<p class="text-muted-foreground text-sm font-medium">10:45</p>
				</div>
				<div class="relative col-span-3">
					<hr class="border-border-input border-1 relative top-4 h-px border-dashed" />

					<div class="bg-background-alt absolute left-1/2 -translate-x-1/2 p-1">
						<Airplane class="text-muted-foreground size-6 rotate-90" />
					</div>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
