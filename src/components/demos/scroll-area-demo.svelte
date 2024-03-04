<script lang="ts">
	import { ScrollArea } from "$lib/index.js";
</script>

<ScrollArea.Root class="relative h-72 w-56 rounded-md border bg-muted shadow-lg">
	<ScrollArea.Viewport class="h-full w-full">
		<ScrollArea.Content>
			<div class="p-4">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos impedit rem, repellat
				deserunt ducimus quasi nisi voluptatem cumque aliquid esse ea deleniti eveniet incidunt!
				Deserunt minus laborum accusamus iusto dolorum. Lorem ipsum dolor sit, amet consectetur
				adipisicing elit. Blanditiis officiis error minima eos fugit voluptate excepturi eveniet
				dolore et, ratione impedit consequuntur dolorem hic quae corrupti autem? Dolorem, sit
				voluptatum.
			</div>
		</ScrollArea.Content>
	</ScrollArea.Viewport>
	<ScrollArea.ScrollbarY
		class="flex h-full w-2.5 touch-none select-none border-l border-l-transparent bg-dark-10 p-px"
	>
		<ScrollArea.ThumbY class="relative flex-1 rounded-full bg-muted-foreground">
			<!-- ... -->
		</ScrollArea.ThumbY>
	</ScrollArea.ScrollbarY>
	<ScrollArea.Corner />
</ScrollArea.Root>
