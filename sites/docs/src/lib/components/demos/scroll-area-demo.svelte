<script lang="ts">
	import { ScrollArea } from "bits-ui";

	let type = $state<"auto" | "hover" | "scroll" | "always">("auto");
	let height = $state(200);
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center gap-4">
		<div class="flex w-1/2 flex-col gap-1">
			<label for="type">Type</label>
			<select bind:value={type} class="border" id="type">
				<option value="auto">auto</option>
				<option value="hover">hover</option>
				<option value="scroll">scroll</option>
				<option value="always">always</option>
			</select>
		</div>
		<div class="flex w-1/2 flex-col gap-1">
			<label for="height">Height</label>
			<input class="border" type="number" bind:value={height} id="height" />
		</div>
	</div>

	<div
		class="max-w-[250px] rounded-[10px] border border-dark-10 bg-background-alt px-2 py-4 shadow-card"
	>
		<ScrollArea.Root
			class="relative overflow-hidden px-4"
			{type}
			style={{ height: `${height}px` }}
		>
			<ScrollArea.Viewport class="h-full w-full">
				<h4
					class="mb-4 mt-2 text-[20px] font-semibold leading-none tracking-[-0.01em] text-foreground"
				>
					Scroll Area
				</h4>
				<p class="text-sm leading-5 text-foreground-alt">
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos impedit
					rem, repellat deserunt ducimus quasi nisi voluptatem cumque aliquid esse ea
					deleniti eveniet incidunt! Deserunt minus laborum accusamus iusto dolorum. Lorem
					ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis officiis error
					minima eos fugit voluptate excepturi eveniet dolore et, ratione impedit
					consequuntur dolorem hic quae corrupti autem? Dolorem, sit voluptatum.
				</p>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar
				orientation="vertical"
				class="flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent bg-muted p-px transition-all duration-200 hover:w-3 hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0"
			>
				<ScrollArea.Thumb
					class="flex-1 rounded-full bg-muted-foreground data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0"
				/>
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner />
		</ScrollArea.Root>
	</div>
</div>
