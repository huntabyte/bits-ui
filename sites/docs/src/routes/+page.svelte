<script lang="ts">
	import "$lib/styles/app.postcss";
	import { Button } from "bits-ui";
	import Sparkle from "phosphor-svelte/lib/Sparkle";
	import CardAir from "$lib/components/homepage/card-air.svelte";
	import CardSound from "$lib/components/homepage/card-sound.svelte";
	import CardTimer from "$lib/components/homepage/card-timer.svelte";
	import CardToggle from "$lib/components/homepage/card-toggle.svelte";
	import { Logo } from "$icons/index.js";
	import LightSwitch from "$lib/components/light-switch.svelte";
</script>

<div class="page_wrap_gradient border-b border-solid border-black/10">
	<header class="grid grid-cols-3 px-5 py-[17px]">
		<a
			href="/"
			class="ml-2 mt-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<Logo />
		</a>

		<nav class="mt-2 text-center">
			<ul>
				<li class="inline-block">
					<a
						data-active
						href="/"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground"
						>Home</a
					>
				</li>
				<li class="inline-block">
					<a
						href="/"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground"
						>Showcase</a
					>
				</li>
				<li class="inline-block">
					<a
						href="/docs"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground"
						>Docs</a
					>
				</li>
			</ul>
		</nav>

		<div class="flex justify-end gap-3">
			<LightSwitch />

			<Button.Root
				class="inline-flex h-10 items-center justify-center rounded-input bg-dark
        px-5 text-[14px] font-semibold text-background shadow-mini
        hover:bg-dark/95 active:scale-98 active:transition-all"
			>
				Get started
			</Button.Root>
		</div>
	</header>

	<section
		class="flex h-[calc(100svh-76px)] flex-col justify-between overflow-hidden pt-[7em] desktop:max-h-[900px]"
	>
		<div class="mx-auto w-7/12 text-center">
			<a
				href="/"
				class="inline-flex gap-2 rounded-card-lg border border-border-input py-1.5 pl-3 pr-4 shadow-mini"
			>
				<Sparkle class="mt-[2px] size-4" aria-label="Stars" />
				<span
					class="inline-block border-l border-l-border-input pl-3 text-[13px] font-medium text-foreground"
					>New Svelte 5 version</span
				>
			</a>
			<h1
				class="mb-[0.35em] mt-[0.2em] text-balance pb-[0.1em] text-[4.25rem] font-semibold leading-[102%] antialiased"
			>
				The headless components for Svelte
			</h1>
			<p
				class="mx-auto mb-[2em] w-9/12 text-[1.125rem] font-medium leading-[144%] text-muted-foreground"
			>
				Bits UI is a collection of headless component primitives that enable you to build
				your own custom components.
			</p>
			<Button.Root
				class="inline-flex h-10 items-center justify-center rounded-input bg-dark
        px-3 shadow-mini
        hover:bg-dark/95 active:scale-98 active:transition-all"
			>
				<kbd
					class="shadow-kbd_homepage pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background-alt px-1.5 font-mono text-xxs font-medium opacity-100 sm:flex"
				>
					<span class="text-xs text-foreground-alt">S</span>
				</kbd>
				<span class="ml-4 mr-3 text-[14px] font-semibold -tracking-[0.01em] text-background"
					>Start building</span
				>
			</Button.Root>
		</div>

		<div class="mx-auto mt-20 grid grid-cols-2 gap-0 lg:grid-cols-[1fr_repeat(4,259px)_1fr]">
			<div class="relative hidden lg:order-1 lg:block">
				<div class="square"></div>
			</div>

			<CardSound />
			<CardAir />
			<CardToggle />
			<CardTimer />

			<div class="relative hidden lg:order-6 lg:block">
				<div class="circle"></div>
			</div>
		</div>
	</section>
</div>

<style lang="postcss">
	.page_wrap_gradient {
		background: linear-gradient(179deg, #fdfdfd 44.88%, rgba(253, 253, 253, 0) 93.29%),
			linear-gradient(0deg, rgba(245, 245, 245, 0.2) 0%, rgba(245, 245, 245, 0.2) 100%);
	}

	h1 {
		font-family: "Cal Sans", sans-serif;
		background: linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0) 41.43%
			),
			#272727;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.square {
		display: inline-block;
		aspect-ratio: 1/1;
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23BABABAFF' stroke-width='2' stroke-dasharray='2%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
		border-radius: 40px;
		position: absolute;
		bottom: -50%;
		right: 10px;
		width: 100%;
		min-width: 200px;
		&:after {
			content: "";
			display: inline-block;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			aspect-ratio: 1/1;
			background: radial-gradient(
				83.66% 83.66% at 95.63% 5.58%,
				rgba(255, 255, 255, 0) 0%,
				#fff 100%
			);
		}
	}

	.circle {
		display: inline-block;
		aspect-ratio: 1/1;
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='200' ry='200' stroke='%23BABABAFF' stroke-width='2' stroke-dasharray='2%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
		border-radius: 200px;
		width: 100%;
		position: absolute;
		bottom: -50%;
		left: 10px;
		min-width: 200px;
		&:after {
			content: "";
			display: inline-block;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			aspect-ratio: 1/1;
			background: radial-gradient(
				84.28% 84.28% at 40.53% 20.39%,
				rgba(255, 255, 255, 0) 0%,
				#fff 100%
			);
		}
	}

	.shadow-kbd_homepage {
		box-shadow: 0px 2px 0px 0px #59595b;
	}
</style>
