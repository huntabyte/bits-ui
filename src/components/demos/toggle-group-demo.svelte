<script lang="ts">
	import { ToggleGroup } from "$lib";
	import { TextB, TextItalic } from "phosphor-svelte";

	let value: string[] | undefined = undefined;
</script>

<ToggleGroup.Root bind:value type="multiple">
	<ToggleGroup.Item
		aria-label="toggle bold"
		value="bold"
		class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98 data-[state=on]:bg-muted"
	>
		<TextB class="sq-6" />
	</ToggleGroup.Item>
	<ToggleGroup.Item
		aria-label="toggle italic"
		value="italic"
		class="inline-flex items-center justify-center rounded-[9px] bg-background transition-all sq-10 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-98 data-[state=on]:bg-muted"
	>
		<TextItalic class="sq-6" />
	</ToggleGroup.Item>
</ToggleGroup.Root>
