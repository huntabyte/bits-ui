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

	import Customizable from "$lib/components/homepage/svg-customizable.svelte";
	import Accessible from "$lib/components/homepage/svg-accessible.svelte";
	import AccessibleDark from "$lib/components/homepage/svg-accessible-dark.svelte";
	import Consistent from "$lib/components/homepage/svg-consistent.svelte";
	import { goto } from "$app/navigation";
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === "s" && !(e.metaKey || e.ctrlKey || e.altKey || e.shiftKey)) {
			goto("/docs");
		}
	}}
/>

<div class="border-b border-solid border-black/10 bg-white dark:border-white/20 dark:bg-[#171717]">
	<header class="flex items-center justify-between px-3 py-[17px] lg:grid lg:grid-cols-3 lg:px-5">
		<a
			href="/"
			class="ml-2 mt-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<Logo />
		</a>

		<nav class="mt-2 flex items-center text-center lg:block">
			<ul>
				<li class="inline-block">
					<a
						data-active
						href="/"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground dark:text-white/50 dark:data-[active]:bg-white/10 dark:data-[active]:text-white/100"
						>Home</a
					>
				</li>
				<li class="inline-block">
					<a
						href="/docs"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground dark:text-white/50 dark:data-[active]:bg-white/10 dark:data-[active]:text-white/100"
						>Docs</a
					>
				</li>
				<li class="inline-block">
					<a
						href="https://github.com/huntabyte/bits-ui"
						target="_blank"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground dark:text-white/50 dark:data-[active]:bg-white/10 dark:data-[active]:text-white/100"
						>GitHub</a
					>
				</li>
			</ul>
			<div class="relative top-[1px] block lg:hidden">
				<LightSwitch />
			</div>
		</nav>

		<div class="hidden justify-end gap-3 lg:flex">
			<LightSwitch />

			<Button.Root
				class="inline-flex h-10 items-center justify-center rounded-input bg-dark
        px-5 text-[14px] font-semibold text-background shadow-mini
        hover:bg-dark/95 active:scale-98 active:transition-all"
				href="/docs"
			>
				Get started
			</Button.Root>
		</div>
	</header>

	<section
		class="flex flex-col justify-between overflow-hidden pt-20 lg:pt-[7em] desktop:max-h-[900px]"
	>
		<div class="mx-7 text-center lg:mx-auto lg:w-7/12">
			<a
				href="https://github.com/huntabyte/bits-ui/releases"
				target="_blank"
				class="inline-flex gap-2 rounded-card-lg border border-border-input bg-white py-1.5 pl-3 pr-4 shadow-mini dark:border-[#F4F4F5]/20 dark:bg-[#242429]"
			>
				<Sparkle class="mt-[2px] size-3 lg:size-4" aria-label="Stars" />
				<span
					class="inline-block border-l border-l-border-input pl-3 text-[11px] font-medium text-foreground lg:text-[13px]"
					>New Stable 1.0 Release</span
				>
			</a>
			<h1
				class="mx-auto mb-[0.35em] mt-[0.2em] text-balance pb-[0.1em] font-['Cal_Sans'] text-[2.875rem] font-semibold leading-[102%] text-transparent antialiased selection:text-foreground dark:!text-[#EAEAEA] dark:selection:text-background lg:max-w-3xl lg:text-[4.25rem]"
			>
				The headless components for Svelte
			</h1>
			<p
				class="mx-auto mb-[2em] max-w-sm text-[0.9rem] font-medium leading-[144%] text-muted-foreground sm:max-w-2xl md:w-9/12 md:max-w-2xl md:text-[1.125rem]"
			>
				Flexible, unstyled, and accessible primitives that provide the foundation for
				building your own high-quality component library.
			</p>
			<Button.Root
				class="inline-flex h-10 items-center justify-center rounded-input bg-dark
        px-3 shadow-mini
        hover:bg-dark/95 active:scale-98 active:transition-all dark:bg-white"
				href="/docs"
			>
				<kbd
					class="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-background-alt px-1.5 font-mono text-xxs font-medium opacity-100 shadow-[0px_2px_0px_0px_#59595b] dark:border-[rgba(0,_0,_0,_0.10)] dark:bg-white dark:shadow-[0px_2px_0px_0px_#B8B8B8]"
				>
					<span class="text-xs text-foreground-alt">S</span>
				</kbd>
				<span
					class="ml-4 mr-3 text-[14px] font-semibold leading-[1] tracking-[0.01em] text-background"
					>Start building</span
				>
			</Button.Root>
		</div>

		<div
			class="mx-2.5 mt-24 grid grid-cols-2 gap-0 sm:mx-auto sm:w-[500px] sm:max-w-[500px] lg:w-[unset] lg:max-w-[unset] lg:grid-cols-[1fr_repeat(4,259px)_1fr]"
		>
			<div class="relative hidden lg:order-1 lg:block">
				<div class="square block dark:hidden dark:after:!hidden"></div>
				<div
					class="dark_square hidden after:!hidden dark:block dark:after:!inline-block"
				></div>
			</div>

			<CardSound />
			<CardAir />
			<CardToggle />
			<CardTimer />

			<div class="relative hidden lg:order-6 lg:block">
				<div class="circle block dark:hidden dark:after:!hidden"></div>
				<div
					class="dark_circle hidden after:!hidden dark:block dark:after:!inline-block"
				></div>
			</div>
		</div>
	</section>
</div>

<section
	class="mx-2.5 mb-20 mt-11 sm:mx-auto sm:max-w-[500px] lg:mb-40 lg:mt-24 lg:w-10/12 lg:max-w-[1036px]"
>
	<h2 class="mb-10 text-balance text-foreground lg:w-1/3">
		<small
			class="rounded-3xl border border-foreground px-2 py-[3px] text-[13px] font-medium tracking-[0.01em]"
			><span class="mr-2.5 inline-block h-[7px] w-[7px] rounded-full bg-foreground/90"
			></span>explore</small
		>
		<span
			class="mt-2 block font-['Cal_Sans'] text-[28px] font-semibold leading-[118%] tracking-[0.02em] lg:text-[32px]"
			>The foundation for your next web project</span
		>
	</h2>
	<div class="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-x-[15px]">
		<div
			class="col-span-2 overflow-hidden rounded-card-lg border border-border shadow-card lg:col-span-1"
		>
			<div
				class="dotted_bg mx-[7px] my-[9px] rounded-15px bg-background bg-[radial-gradient(#DEDEDE_1px,transparent_0)] dark:bg-[#1E1E22] dark:bg-[radial-gradient(#36363A_1px,transparent_0)]"
			>
				<h3
					class="px-[14px] pt-4 text-base font-semibold leading-[1] -tracking-[0.01em] text-foreground lg:pt-5 lg:text-[17px]"
				>
					Customizable
				</h3>

				<div class="pb-10 pt-8 lg:pb-16 lg:pt-9">
					<div
						class="relative mx-auto aspect-[354/259] w-10/12 overflow-hidden bg-transparent lg:left-12 lg:ml-auto lg:w-full"
					>
						<Customizable />
					</div>
				</div>

				<div
					class="px-[14px] pb-4 text-[11px] font-medium text-muted-foreground lg:text-sm"
				>
					Freedom with foundation.
				</div>
			</div>
		</div>

		<div
			class="overflow-hidden rounded-card-lg border border-border bg-[#F8F8F8] shadow-card dark:bg-muted"
		>
			<div class="bg-transparent px-[7px] py-[9px]">
				<h3
					class="px-[14px] pt-4 text-base font-semibold leading-[1] -tracking-[0.01em] text-foreground lg:pt-5 lg:text-[17px]"
				>
					Accessible
				</h3>

				<div class="pb-5 pt-8 lg:pb-16 lg:pt-9">
					<div
						class="relative left-[30px] aspect-[186/150] w-full overflow-hidden bg-transparent lg:left-14 lg:aspect-[354/259]"
					>
						<Accessible />
						<AccessibleDark />
					</div>
				</div>

				<div
					class="px-[14px] pb-2 text-[11px] font-medium text-muted-foreground lg:pb-4 lg:text-sm"
				>
					Built for everyone, by default.
				</div>
			</div>
		</div>

		<div
			class="overflow-hidden rounded-card-lg border border-white bg-[#2A2A2E] shadow-card dark:border-[#F4F4F5]/10 dark:bg-[#3A3C42]"
		>
			<div class="bg-transparent px-[7px] py-[9px]">
				<h3
					class="px-[14px] pt-4 text-base font-semibold leading-[1] -tracking-[0.01em] text-background dark:text-foreground lg:pt-5 lg:text-[17px]"
				>
					Unified
				</h3>

				<div class="pb-5 pt-8 lg:pb-16 lg:pt-9">
					<div
						class="relative left-6 aspect-[186/150] w-full overflow-hidden bg-transparent lg:left-[50px] lg:aspect-[354/259]"
					>
						<Consistent />
					</div>
				</div>

				<div
					class="px-[14px] pb-2 text-[11px] font-medium text-white/40 dark:text-[#B0B0B3] lg:pb-4 lg:text-sm"
				>
					Predictable patterns, powerful results.
				</div>
			</div>
		</div>
	</div>
</section>

<footer
	class="flex justify-between border-t border-black/10 px-[22px] pb-10 pt-6 dark:border-foreground/10"
>
	<div class="flex items-center gap-2 text-sm font-medium text-muted-foreground lg:gap-3">
		<span class="block aspect-square h-3 w-3 rounded-full bg-foreground/20"></span>2025 Bits UI
		team
	</div>
	<ul class="flex items-center justify-end gap-3 lg:gap-[26px]">
		<li>
			<a
				href="https://github.com/huntabyte/bits-ui"
				target="_blank"
				class="text-sm font-medium text-muted-foreground">GitHub</a
			>
		</li>
		<li>
			<a
				href="https://github.com/huntabyte/bits-ui/releases"
				target="_blank"
				class="text-sm font-medium text-muted-foreground">Changelog</a
			>
		</li>
	</ul>
</footer>

<style lang="postcss">
	h1 {
		background: linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0) 41.43%
			),
			#272727;
		background-clip: text;
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

	.dark_square {
		display: inline-block;
		aspect-ratio: 1/1;
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23B2B2B2FF' stroke-width='2' stroke-dasharray='2%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
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
				#171717 100%
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

	.dark_circle {
		display: inline-block;
		aspect-ratio: 1/1;
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='200' ry='200' stroke='%23B2B2B2FF' stroke-width='2' stroke-dasharray='2%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
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
				#171717 100%
			);
		}
	}
	.dotted_bg {
		//background-image: radial-gradient(#dedede 1px, transparent 0);
		background-size: 15px 15px;
		background-position: 0px 0px;
	}
</style>
