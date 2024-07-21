<script lang="ts">
	import { ScrollArea } from "bits-ui";
</script>

<div
	class="max-w-[250px] rounded-[10px] border border-dark-10 bg-background-alt px-2 py-4 shadow-card"
>
	<ScrollArea.Root class="relative h-[205px] px-4">
		<ScrollArea.Viewport class="h-full w-full">
			<h4
				class="mb-4 mt-2 text-[20px] font-semibold leading-none tracking-[-0.01em] text-foreground"
			>
				Scroll Area
			</h4>
			<p class="text-sm leading-5 text-foreground-alt">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos impedit rem,
				repellat deserunt ducimus quasi nisi voluptatem cumque aliquid esse ea deleniti
				eveniet incidunt! Deserunt minus laborum accusamus iusto dolorum. Lorem ipsum dolor
				sit, amet consectetur adipisicing elit. Blanditiis officiis error minima eos fugit
				voluptate excepturi eveniet dolore et, ratione impedit consequuntur dolorem hic quae
				corrupti autem? Dolorem, sit voluptatum.
			</p>
		</ScrollArea.Viewport>
		<ScrollArea.Scrollbar
			orientation="vertical"
			class="flex h-full w-2.5 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all hover:w-3 hover:bg-dark-10"
		>
			<ScrollArea.Thumb
				class="relative flex-1 rounded-full bg-muted-foreground opacity-40 transition-opacity hover:opacity-100"
			/>
		</ScrollArea.Scrollbar>
		<ScrollArea.Corner />
	</ScrollArea.Root>
</div>
