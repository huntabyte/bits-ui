<script lang="ts">
	import HomeToolbar from "$lib/components/homepage/home-toolbar.svelte";
</script>

<div class="outer relative order-4 lg:order-2">
	<div class="line line_top"></div>
	<div class="line line_left"></div>
	<div class="line line_right"></div>

	<div
		class="m-[10px] aspect-square overflow-hidden rounded-card-lg bg-foreground px-[14px] py-3"
	>
		<div class="flex justify-between">
			<h3 class="ml-[6px] mt-[7px] text-xl font-medium text-background">
				<span class="">Sound</span>
				<small class="block text-xs opacity-50">control</small>
			</h3>
			<HomeToolbar />
		</div>

		<div class="sound_meter relative bg-background">
			<div class="sound_meter__toggle h-[26px] w-2 rounded-card-sm bg-rose-500"></div>
			<div class="sound_meter__labels">
				<div class="sound_meter__label label_left">L</div>
				<div class="sound_meter__label label_right">R</div>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	/* lines */
	.line_top {
		position: absolute;
		top: 0;
		left: -40px;
		width: calc(100% + 50px);
		height: 1px;
		background: linear-gradient(to right, transparent 50%, white 50%),
			linear-gradient(to right, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			10px 1px,
			100% 1px;
	}
	.line_left {
		position: absolute;
		left: 0;
		bottom: 0;
		top: -100px;
		width: 1px;
		background: linear-gradient(to top, transparent 50%, white 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
		transform: rotate(180deg);
	}
	.line_right {
		position: absolute;
		right: 0;
		bottom: 0;
		top: -200px;
		width: 1px;
		background: linear-gradient(to top, transparent 50%, white 50%),
			linear-gradient(to top, rgba(186, 186, 186, 0), rgba(186, 186, 186, 1));
		background-size:
			1px 10px,
			100% 100%;
		transform: rotate(180deg);
	}

	.outer {
		@media screen and (min-width: 1024px) {
			transform: translateY(33%);
		}
	}
	.sound_meter {
		width: 189px;
		aspect-ratio: 1/1;
		border-radius: 50%;
		margin-top: 5px;
		margin-inline: auto;
	}
	.sound_meter__toggle {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
	}
	.sound_meter__labels {
		position: absolute;
		top: 50%;
		left: 8px;
		right: 8px;
		transform: translateY(-50%);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.sound_meter__label {
		color: #17171766;
		display: flex;
		align-items: center;
		gap: 8px;
		&.label_left {
			&:before {
				content: "";
				display: inline-block;
				width: 7px;
				height: 7px;
				border-radius: 50%;
				aspect-ratio: 1/1;
				background-color: #cbcbcbb2;
			}
		}
		&.label_right {
			&:after {
				content: "";
				display: inline-block;
				width: 7px;
				height: 7px;
				border-radius: 50%;
				aspect-ratio: 1/1;
				background-color: #cbcbcbb2;
			}
		}
	}
</style>
