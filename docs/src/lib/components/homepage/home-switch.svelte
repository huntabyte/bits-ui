<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { Switch } from "bits-ui";
	import Play from "phosphor-svelte/lib/Play";
	import Pause from "phosphor-svelte/lib/Pause";

	let {
		checked = $bindable(true),
		ref = $bindable(null),
		...restProps
	}: ComponentProps<typeof Switch.Root> = $props();
</script>

<div class="flex items-center space-x-3">
	<Switch.Root
		bind:ref
		bind:checked
		id="play_btn"
		name="play"
		aria-label="Play"
		class="focus-visible:ring-foreground focus-visible:ring-offset-background data-[state=checked]:bg-foreground data-[state=unchecked]:bg-dark-10 data-[state=unchecked]:shadow-mini-inset dark:data-[state=checked]:bg-foreground focus-visible:outline-hidden peer inline-flex h-7 min-h-7 w-11 shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:h-9 lg:min-h-9 lg:w-[62px]  dark:shadow-inner dark:data-[state=unchecked]:bg-[rgba(0,0,0,0.17)]"
		{...restProps}
	>
		<Switch.Thumb
			class="bg-background data-[state=unchecked]:shadow-mini dark:border-background/30 group pointer-events-none flex size-[22px] shrink-0 items-center justify-center rounded-full transition-transform data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-0 lg:size-[30px] lg:data-[state=checked]:translate-x-[26px] dark:border dark:border-none dark:bg-white dark:shadow-[0px_1.3px_0px_1.3px_rgba(0,0,0,0.04)] dark:data-[state=unchecked]:border"
		>
			<Play
				class="size-2.5 group-data-[state=checked]:hidden lg:size-4 dark:text-[#171717]"
				weight="fill"
				aria-label="Play"
			/>
			<Pause
				class="size-2.5 group-data-[state=unchecked]:hidden lg:size-4 dark:text-[#171717]"
				weight="fill"
				aria-label="Pause"
			/>
		</Switch.Thumb>
	</Switch.Root>
</div>
