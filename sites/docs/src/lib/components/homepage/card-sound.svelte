<script lang="ts">
	import { mode } from "mode-watcher";
	import HomeToolbar from "$lib/components/homepage/home-toolbar.svelte";
</script>

<div class="relative order-1 lg:order-2 translate-y-14 lg:translate-y-1/3">
	<div
		class="hidden lg:block line_top_gradient absolute -left-10 top-0 h-[1px] w-[calc(100%+50px)] {$mode ===
		'dark'
			? 'dark'
			: ''}"
	></div>
	<div
		class="hidden lg:block line_left_gradient absolute -top-[100px] bottom-0 left-0 w-px rotate-180 {$mode ===
		'dark'
			? 'dark'
			: ''}"
	></div>
	<div
		class="line_right_gradient absolute -top-20 lg:-top-[200px] bottom-7 lg:bottom-0 right-0 w-px rotate-180 {$mode ===
		'dark'
			? 'dark'
			: ''}"
	></div>

	<div
		class="dark:border:[rgba(254,_254,_254,_0.15)] m-1.5 lg:m-2.5 aspect-square overflow-hidden rounded-card-lg bg-foreground px-[14px] py-2.5 lg:py-3 dark:border dark:bg-[#2A2B2E]"
	>
		<div class="flex justify-between items-start">
			<h3 class="ml-1.5 lg:mt-[7px] text-sm lg:text-xl font-medium text-background dark:text-white">
				<span class="">Sound</span>
				<small class="block text-[10px] lg:text-xs opacity-50 leading-[1]">control</small>
			</h3>
			<HomeToolbar />
		</div>

		<div
			class="relative mx-auto mt-3 lg:mt-[5px] aspect-square w-[115px] sm:w-10/12 lg:w-[189px] rounded-[50%] bg-background dark:bg-white"
		>
			<div
				class="absolute left-1/2 top-2.5 h-4 lg:h-[26px] w-[5px] lg:w-2 -translate-x-1/2 rounded-card-sm bg-rose-500"
			></div>
			<div
				class="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 items-center justify-between"
			>
				<div
					class="text-[8px] lg:text-[13px] flex items-center gap-1 lg:gap-2 text-[#17171766] before:inline-block before:aspect-square before:size-1 lg:before:size-[7px] before:rounded-[50%] before:bg-[#cbcbcbb2] before:content-['']"
				>
					L
				</div>
				<div
					class="text-[8px] lg:text-[13px] flex items-center gap-1 lg:gap-2 text-[#17171766] after:inline-block after:aspect-square after:size-1 lg:after:size-[7px] after:rounded-[50%] after:bg-[#cbcbcbb2] after:content-['']"
				>
					R
				</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	/* lines */
	.line_top_gradient {
		background: linear-gradient(to right, transparent 50%, white 50%),
			linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			10px 1px,
			100% 1px;
		&.dark {
			background: linear-gradient(to right, transparent 50%, #171717 50%),
				linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
			background-size:
				10px 1px,
				100% 1px;
		}
	}
	.line_left_gradient {
		background: linear-gradient(to top, transparent 50%, white 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
		&.dark {
			background: linear-gradient(to top, transparent 50%, #171717 50%),
				linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
			background-size:
				1px 10px,
				100% 100%;
		}
	}
	.line_right_gradient {
		background: linear-gradient(to top, transparent 50%, white 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
		&.dark {
			background: linear-gradient(to top, transparent 50%, #171717 50%),
				linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
			background-size:
				1px 10px,
				100% 100%;
		}
	}
</style>
