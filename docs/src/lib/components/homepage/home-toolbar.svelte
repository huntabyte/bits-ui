<script lang="ts">
	import { Toolbar } from "bits-ui";
	import WaveSine from "phosphor-svelte/lib/WaveSine";
	import WaveSquare from "phosphor-svelte/lib/WaveSquare";
	import WaveTriangle from "phosphor-svelte/lib/WaveTriangle";

	let wave = $state("sine");
</script>

<Toolbar.Root
	class="bg-background-alt flex h-7 w-min items-center rounded-[5px] px-[3px] lg:h-10 lg:rounded-[7px] lg:px-[4px] dark:bg-white"
>
	<Toolbar.Group bind:value={wave} type="single" class="inline-flex items-center gap-x-0.5">
		<Toolbar.GroupItem
			aria-label="wave sine"
			value="sine"
			class="bg-background-alt text-foreground/60 hover:bg-muted data-[state=on]:bg-foreground data-[state=on]:text-background active:data-[state=on]:bg-dark-10 inline-flex size-6 cursor-pointer items-center justify-center rounded-[7px] transition-all active:scale-[0.98] lg:size-8  dark:bg-white dark:text-[#808080] dark:data-[state=on]:bg-[#18181B] dark:data-[state=on]:text-white"
		>
			<WaveSine class="size-[14px] lg:size-5" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="wave square"
			value="square"
			class="bg-background-alt text-foreground/60 hover:bg-muted data-[state=on]:bg-foreground data-[state=on]:text-background active:data-[state=on]:bg-dark-10 inline-flex size-6 cursor-pointer items-center justify-center rounded-[7px] transition-all active:scale-[0.98] lg:size-8 dark:bg-white dark:text-[#808080] dark:data-[state=on]:bg-[#18181B] dark:data-[state=on]:text-white"
		>
			<WaveSquare class="size-[14px] lg:size-5" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="wave triangle"
			value="triangle"
			class="bg-background-alt text-foreground/60 hover:bg-muted data-[state=on]:bg-foreground  data-[state=on]:text-background active:data-[state=on]:bg-dark-10 inline-flex size-6 cursor-pointer items-center justify-center rounded-[7px] transition-all active:scale-[0.98] lg:size-8 dark:bg-white dark:text-[#808080] dark:data-[state=on]:bg-[#18181B] dark:data-[state=on]:text-white"
		>
			<WaveTriangle class="size-[14px] lg:size-5" />
		</Toolbar.GroupItem>
	</Toolbar.Group>
</Toolbar.Root>
