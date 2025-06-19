<script lang="ts">
	import HomeToolbar from "$lib/components/homepage/home-toolbar.svelte";
</script>

<div class="relative order-1 translate-y-14 lg:order-2 lg:translate-y-1/3">
	<div
		class="line_top_gradient absolute -left-10 top-0 hidden h-[1px] w-[calc(100%+50px)] lg:block"
	></div>
	<div
		class="line_left_gradient absolute -top-[100px] bottom-0 left-0 hidden w-px rotate-180 lg:block"
	></div>
	<div
		class="line_right_gradient absolute -top-20 bottom-7 right-0 w-px rotate-180 lg:-top-[200px] lg:bottom-0"
	></div>

	<div
		class="dark:border:[rgba(254,_254,_254,_0.15)] rounded-card-lg bg-foreground m-1.5 aspect-square overflow-hidden px-[14px] py-2.5 lg:m-2.5 lg:py-3 dark:border dark:bg-[#2A2B2E]"
	>
		<div class="flex items-start justify-between">
			<span
				class="text-background ml-1.5 text-sm font-medium lg:mt-[7px] lg:text-xl dark:text-white"
			>
				<span class="">Sound</span>
				<small class="block text-[10px] leading-none opacity-50 lg:text-xs">control</small>
			</span>
			<HomeToolbar />
		</div>

		<div
			class="bg-background relative mx-auto mt-3 aspect-square w-[115px] rounded-[50%] sm:w-10/12 lg:mt-[5px] lg:w-[189px] dark:bg-white"
		>
			<div
				class="rounded-card-sm absolute left-1/2 top-2.5 h-4 w-[5px] -translate-x-1/2 bg-rose-500 lg:h-[26px] lg:w-2"
			></div>
			<div
				class="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 items-center justify-between"
			>
				<div
					class="flex items-center gap-1 text-[8px] text-[#17171766] before:inline-block before:aspect-square before:size-1 before:rounded-[50%] before:bg-[#cbcbcbb2] before:content-[''] lg:gap-2 lg:text-[13px] lg:before:size-[7px]"
				>
					L
				</div>
				<div
					class="flex items-center gap-1 text-[8px] text-[#17171766] after:inline-block after:aspect-square after:size-1 after:rounded-[50%] after:bg-[#cbcbcbb2] after:content-[''] lg:gap-2 lg:text-[13px] lg:after:size-[7px]"
				>
					R
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* lines */
	.line_top_gradient {
		background:
			linear-gradient(to right, transparent 50%, var(--line) 50%),
			linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			10px 1px,
			100% 1px;
	}
	.line_left_gradient {
		background:
			linear-gradient(to top, transparent 50%, var(--line) 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
	}
	.line_right_gradient {
		background:
			linear-gradient(to top, transparent 50%, var(--line) 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
	}
</style>
