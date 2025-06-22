<script lang="ts">
	import { Accordion } from "bits-ui";

	let value = $state("item-1");

	const items = [
		{
			id: "item-1",
			title: "Mountain Range",
			image: "https://images.unsplash.com/photo-1586589058841-f1264894a260?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
			description: "Majestic mountain ranges with snow-capped peaks and lush valleys.",
		},
		{
			id: "item-2",
			title: "Ocean Views",
			image: "https://images.unsplash.com/photo-1650300874827-7d39bc9276ea?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
			description:
				"Serene ocean scenes with crashing waves, beautiful sunsets, and sandy beaches.",
		},
		{
			id: "item-3",
			title: "Forest Retreats",
			image: "https://images.unsplash.com/photo-1693297490324-37ee6301f6c8?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3",
			description:
				"Dense forests with towering trees, abundant wildlife, and peaceful streams.",
		},
	];
</script>

<Accordion.Root
	type="single"
	orientation="horizontal"
	class="flex h-[400px] w-full gap-2 sm:flex-row"
	bind:value
>
	{#each items as item (item.id)}
		<Accordion.Item
			value={item.id}
			class="ring-primary/70 relative cursor-pointer overflow-hidden rounded-lg transition-all duration-500 ease-in-out data-[state=closed]:w-[20%] data-[state=open]:w-[100%] md:data-[state=closed]:w-[10%] [&:has(:focus-visible)]:ring-2"
			onclick={() => (value = item.id)}
		>
			<img src={item.image} alt={item.title} class="h-[400px] w-full object-cover" />
			<div
				class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4"
			>
				<div
					class="transition-all duration-300 group-data-[state=closed]:translate-y-2 group-data-[state=open]:translate-y-0"
				>
					<Accordion.Header>
						<Accordion.Trigger
							class="focus-override text-left font-bold text-white transition-all duration-300 focus-visible:!outline-none data-[state=open]:mb-2 data-[state=closed]:text-sm data-[state=open]:text-base data-[state=closed]:opacity-0 data-[state=open]:opacity-100 md:data-[state=open]:text-xl"
						>
							{item.title}
						</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Content
						forceMount
						class="max-h-0 overflow-hidden text-white/90 transition-all duration-700 data-[state=open]:max-h-[100px] data-[state=open]:text-xs data-[state=closed]:opacity-0 data-[state=open]:opacity-100 md:data-[state=open]:text-base"
					>
						{item.description}
					</Accordion.Content>
					<div
						class="absolute bottom-0 left-0 h-1 w-full transition-all duration-300 group-data-[state=closed]:opacity-0 group-data-[state=open]:opacity-100"
					></div>
				</div>
			</div>
		</Accordion.Item>
	{/each}
</Accordion.Root>
