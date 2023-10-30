<script lang="ts">
	import { ToggleGroup } from "$lib";
	import { Bold, Italic } from "lucide-svelte";
	import { toggleVariants } from "@/components/ui/toggle";
</script>

<ToggleGroup.Root>
	<ToggleGroup.Item
		class={toggleVariants({ variant: "default" })}
		aria-label="toggle bold"
		value="bold"
	>
		<Bold class="h-4 w-4" />
	</ToggleGroup.Item>
	<ToggleGroup.Item
		class={toggleVariants({ variant: "default" })}
		aria-label="toggle italic"
		value="italic"
	>
		<Italic class="h-4 w-4" />
	</ToggleGroup.Item>
</ToggleGroup.Root>
