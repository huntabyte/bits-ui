<script lang="ts">
	import { Toolbar } from "bits-ui";
	import WaveSine from "phosphor-svelte/lib/WaveSine";
	import WaveSquare from "phosphor-svelte/lib/WaveSquare";
	import WaveTriangle from "phosphor-svelte/lib/WaveTriangle";

	let wave = $state("sine");
</script>

<Toolbar.Root
	class="flex h-7 w-min items-center rounded-[5px] bg-background-alt px-[3px] dark:bg-white lg:h-10 lg:rounded-[7px] lg:px-[5px]"
>
	<Toolbar.Group bind:value={wave} type="single" class="inline-flex items-center gap-x-0.5">
		<Toolbar.GroupItem
			aria-label="wave sine"
			value="sine"
			class="inline-flex size-6 items-center justify-center rounded-[7px] bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-98 active:bg-foreground data-[state=on]:bg-foreground data-[state=on]:text-background active:data-[state=on]:bg-dark-10 dark:bg-white  dark:text-[#808080] dark:data-[state=on]:bg-[#18181B] dark:data-[state=on]:text-white lg:size-8"
		>
			<WaveSine class="size-[14px] lg:size-5" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="wave square"
			value="square"
			class="inline-flex size-6 items-center justify-center rounded-[7px] bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-98 active:bg-foreground data-[state=on]:bg-foreground data-[state=on]:text-background active:data-[state=on]:bg-dark-10 dark:bg-white dark:text-[#808080] dark:data-[state=on]:bg-[#18181B] dark:data-[state=on]:text-white lg:size-8"
		>
			<WaveSquare class="size-[14px] lg:size-5" />
		</Toolbar.GroupItem>
		<Toolbar.GroupItem
			aria-label="wave triangle"
			value="triangle"
			class="inline-flex size-6 items-center justify-center rounded-[7px] bg-background-alt text-foreground/60 transition-all hover:bg-muted active:scale-98 active:bg-foreground data-[state=on]:bg-foreground data-[state=on]:text-background active:data-[state=on]:bg-dark-10 dark:bg-white dark:text-[#808080] dark:data-[state=on]:bg-[#18181B] dark:data-[state=on]:text-white lg:size-8"
		>
			<WaveTriangle class="size-[14px] lg:size-5" />
		</Toolbar.GroupItem>
	</Toolbar.Group>
</Toolbar.Root>
