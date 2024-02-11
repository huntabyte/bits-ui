<script lang="ts">
	import { Tabs, Label, Button } from "$lib";
	import { Airplane } from "$icons/index.js";
</script>

<div class="pt-6">
	<Tabs.Root
		value="outbound"
		class="w-[390px] rounded-card border border-muted bg-background p-3 shadow-card"
	>
		<Tabs.List
			class="grid w-full grid-cols-2 gap-1 rounded-9px bg-dark-10 p-1 text-sm font-semibold leading-[0.01em] shadow-mini-inset"
		>
			<Tabs.Trigger
				value="outbound"
				class="h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white data-[state=active]:shadow-mini dark:data-[state=active]:bg-background"
				>Outbound</Tabs.Trigger
			>
			<Tabs.Trigger
				value="inbound"
				class="h-8 rounded-[7px] bg-transparent py-2 data-[state=active]:bg-white data-[state=active]:shadow-mini dark:data-[state=active]:bg-background"
				>Inbound</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="outbound" class="pt-3">
			<div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
				<div class="text-left">
					<h4 class="text-[20px] font-semibold leading-none tracking-[-0.01em] mb-2">
						Prague
					</h4>
					<p class="text-sm font-medium text-muted-foreground">06:05</p>
				</div>
				<div class="text-center self-end">
					<p class="text-sm font-medium text-muted-foreground">3h 30m</p>
				</div>
				<div class="text-right">
					<h4 class="text-[20px] font-semibold leading-none tracking-[-0.01em] mb-2">
						Malaga
					</h4>
					<p class="text-sm font-medium text-muted-foreground">06:05</p>
				</div>
				<div class="col-span-3 relative">
					<hr class="h-px border-dashed border-1 border-border-input relative top-4">

					<div class="p-1 absolute left-1/2 -translate-x-1/2 bg-background"><Airplane class="size-6 text-muted-foreground rotate-90" /></div>
				</div>
			</div>
			
		</Tabs.Content>
		<Tabs.Content value="inbound" class="pt-3">
			<div class="grid grid-cols-3 grid-rows-2 gap-0 p-4 pb-1">
				<div class="text-left">
					<h4 class="text-[20px] font-semibold leading-none tracking-[-0.01em] mb-2">
						Malaga
					</h4>
					<p class="text-sm font-medium text-muted-foreground">07:25</p>
				</div>
				<div class="text-center self-end">
					<p class="text-sm font-medium text-muted-foreground">3h 20m</p>
				</div>
				<div class="text-right">
					<h4 class="text-[20px] font-semibold leading-none tracking-[-0.01em] mb-2">
						Prague
					</h4>
					<p class="text-sm font-medium text-muted-foreground">10:45</p>
				</div>
				<div class="col-span-3 relative">
					<hr class="h-px border-dashed border-1 border-border-input relative top-4">

					<div class="p-1 absolute left-1/2 -translate-x-1/2 bg-background"><Airplane class="size-6 text-muted-foreground rotate-90" /></div>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</div>
