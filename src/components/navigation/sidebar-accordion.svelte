<script lang="ts">
	import { Accordion as AccordionPrimitive } from "@/lib";
	import { ChevronRight } from "lucide-svelte";
	import { slide } from "svelte/transition";
</script>

<AccordionPrimitive.Root>
	<AccordionPrimitive.Header>
		<AccordionPrimitive.Item value="getting-started">
			<AccordionPrimitive.Trigger
				class="flex items-center gap-1.5 group mb-3 w-full focus-visible:outline-ring [&[data-state=open]>svg]:rotate-90"
			>
				<span class="text-sm/6 font-semibold truncate"> Getting Started </span>
				<ChevronRight
					class="h-4 w-4 flex-shrink-0 text-muted-foreground transition-all duration-150 ml-auto mr-1.5 group-hover:text-foreground/80"
				/>
			</AccordionPrimitive.Trigger>
			<AccordionPrimitive.Content transition={slide} transitionConfig={{ duration: 150 }}
				>Hello world</AccordionPrimitive.Content
			>
		</AccordionPrimitive.Item>
	</AccordionPrimitive.Header>
</AccordionPrimitive.Root>
