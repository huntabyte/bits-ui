<script lang="ts">
	import HomeToolbar from "$lib/components/homepage/home-toolbar.svelte";
</script>

<div class="relative order-4 lg:order-2 lg:translate-y-1/3">
	<div class="w-[calc(100% + 50px) line_top_gradient absolute -left-10 top-0 h-px"></div>
	<div class="line_left_gradient absolute -top-[100px] bottom-0 left-0 w-px rotate-180"></div>
	<div class="line_right_gradient absolute -top-[200px] bottom-0 right-0 w-px rotate-180"></div>

	<div class="m-2.5 aspect-square overflow-hidden rounded-card-lg bg-foreground px-[14px] py-3">
		<div class="flex justify-between">
			<h3 class="ml-1.5 mt-[7px] text-xl font-medium text-background">
				<span class="">Sound</span>
				<small class="block text-xs opacity-50">control</small>
			</h3>
			<HomeToolbar />
		</div>

		<div class="relative mx-auto mt-[5px] aspect-square w-[189px] rounded-[50%] bg-background">
			<div
				class="absolute left-1/2 top-2.5 h-[26px] w-2 -translate-x-1/2 rounded-card-sm bg-rose-500"
			></div>
			<div
				class="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 items-center justify-between"
			>
				<div
					class="flex items-center gap-2 text-[#17171766] before:inline-block before:aspect-square before:size-[7px] before:rounded-[50%] before:bg-[#cbcbcbb2] before:content-['']"
				>
					L
				</div>
				<div
					class="flex items-center gap-2 text-[#17171766] after:inline-block after:aspect-square after:size-[7px] after:rounded-[50%] after:bg-[#cbcbcbb2] after:content-['']"
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
	}
	.line_left_gradient {
		background: linear-gradient(to top, transparent 50%, white 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
	}
	.line_right_gradient {
		background: linear-gradient(to top, transparent 50%, white 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
	}
</style>
