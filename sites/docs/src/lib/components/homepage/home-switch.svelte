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
		class="peer inline-flex h-9 min-h-9 w-[62px] shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=unchecked]:bg-dark-10 data-[state=unchecked]:shadow-mini-inset dark:data-[state=checked]:bg-foreground"
		{...restProps}
	>
		<Switch.Thumb
			class="group pointer-events-none flex size-[30px] shrink-0 items-center justify-center rounded-full bg-background transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 data-[state=unchecked]:shadow-mini dark:border dark:border-background/30 dark:bg-foreground dark:shadow-popover dark:data-[state=unchecked]:border"
		>
			<Play
				class="size-4 group-data-[state=checked]:hidden"
				weight="fill"
				aria-label="Play"
			/>
			<Pause
				class="size-4 group-data-[state=unchecked]:hidden"
				weight="fill"
				aria-label="Pause"
			/>
		</Switch.Thumb>
	</Switch.Root>
</div>
