<script lang="ts">
	import "$lib/styles/app.postcss";
	import { Button } from "bits-ui";
	import Sparkle from "phosphor-svelte/lib/Sparkle";
	import SlidersHorizontal from "phosphor-svelte/lib/SlidersHorizontal";
	import Keyboard from "phosphor-svelte/lib/Keyboard";
	import Stack from "phosphor-svelte/lib/Stack";
	import { mode } from "mode-watcher";
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
</script>

<div class="border-b border-solid border-black/10 bg-white dark:border-white/20 dark:bg-[#171717]">
	<header class="flex items-center justify-between lg:grid lg:grid-cols-3 px-3 lg:px-5 py-[17px]">
		<a
			href="/"
			class="ml-2 mt-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
		>
			<Logo />
		</a>

		<nav class="flex items-center lg:block mt-2 text-center">
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
						href="https://github.com/huntabyte/bits-ui" target="_blank"
						class="rounded-[40px] px-[0.9em] pb-[0.4em] pt-[0.3em] text-sm font-medium leading-[1] tracking-[0.01em] data-[active]:bg-black/5 data-[active]:text-foreground dark:text-white/50 dark:data-[active]:bg-white/10 dark:data-[active]:text-white/100"
						>Github</a
					>
				</li>
			</ul>
      <div class="block lg:hidden relative top-[1px]">
        <LightSwitch />
      </div>
		</nav>

		<div class="hidden lg:flex justify-end gap-3">
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
		<div class="mx-7 lg:mx-auto lg:w-7/12 text-center">
			<a
				href="https://github.com/huntabyte/bits-ui/releases" target="_blank"
				class="inline-flex gap-2 rounded-card-lg border border-border-input bg-white py-1.5 pl-3 pr-4 shadow-mini dark:border-[#F4F4F5]/20 dark:bg-[#242429]"
			>
				<Sparkle class="mt-[2px] size-3 lg:size-4" aria-label="Stars" />
				<span
					class="inline-block border-l border-l-border-input pl-3 text-[11px] lg:text-[13px] font-medium text-foreground"
					>New Svelte 5 version</span
				>
			</a>
			<h1
				class="mb-[0.35em] mt-[0.2em] text-balance pb-[0.1em] font-['Cal_Sans'] text-[2.875rem] lg:text-[4.25rem] font-semibold leading-[102%] text-transparent antialiased selection:text-foreground dark:!text-[#EAEAEA] dark:selection:text-background"
			>
				The headless components for Svelte
			</h1>
			<p
				class="mx-auto mb-[2em] lg:w-9/12 text-[0.9rem] lg:text-[1.125rem] font-medium leading-[144%] text-muted-foreground"
			>
				Bits UI is a collection of headless component primitives that enable you to build
				your own custom components.
			</p>
			<Button.Root
				class="inline-flex h-10 items-center justify-center rounded-input bg-dark
        px-3 shadow-mini
        hover:bg-dark/95 active:scale-98 active:transition-all dark:bg-white"
				href="/docs"
			>
				<kbd
					class="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-background-alt px-1.5 font-mono text-xxs font-medium opacity-100 shadow-[0px_2px_0px_0px_#59595b] dark:border-[rgba(0,_0,_0,_0.10)] dark:bg-white dark:shadow-[0px_2px_0px_0px_#B8B8B8] flex"
				>
					<span class="text-xs text-foreground-alt">S</span>
				</kbd>
				<span
					class="ml-4 mr-3 text-[14px] font-semibold leading-[1] tracking-[0.01em] text-background"
					>Start building</span
				>
			</Button.Root>
		</div>

		<div class="mx-2.5 sm:max-w-[500px] sm:w-[500px] lg:max-w-[unset] lg:w-[unset] sm:mx-auto mt-24 grid grid-cols-2 gap-0 lg:grid-cols-[1fr_repeat(4,259px)_1fr]">
			<div class="relative hidden lg:order-1 lg:block">
				<div class="square {$mode === 'dark' ? 'dark' : ''}"></div>
			</div>

			<CardSound />
			<CardAir />
			<CardToggle />
			<CardTimer />

			<div class="relative hidden lg:order-6 lg:block">
				<div class="circle {$mode === 'dark' ? 'dark' : ''}"></div>
			</div>
		</div>
	</section>
</div>

<section class="mb-20 lg:mb-40 mt-11 lg:mt-24 mx-2.5 lg:w-10/12 lg:max-w-[1036px] sm:mx-auto sm:max-w-[500px]">
	<h2 class="mb-10 lg:w-1/3 text-balance text-foreground">
		<small
			class="rounded-3xl border border-foreground px-2 py-[3px] text-[13px] font-medium tracking-[0.01em]"
			><span class="mr-2.5 inline-block h-[7px] w-[7px] rounded-full bg-foreground/90"
			></span>explore</small
		>
		<span
			class="mt-2 block font-['Cal_Sans'] text-[28px] lg:text-[32px] font-semibold leading-[118%] tracking-[0.02em]"
			>Main benefits of using our headless collection</span
		>
	</h2>
	<div class="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-[15px]">

		<div class="overflow-hidden rounded-card-lg border border-border shadow-card col-span-2 lg:col-span-1">	
      <div class="mx-[7px] my-[9px] rounded-15px bg-background dotted_bg dark:bg-[#1E1E22] bg-[radial-gradient(#DEDEDE_1px,transparent_0)] dark:bg-[radial-gradient(#36363A_1px,transparent_0)]">		
        <h3 class="text-base lg:text-[17px] font-semibold -tracking-[0.01em] px-[14px] pt-4 lg:pt-5 text-foreground leading-[1]">Customizable</h3>

				<div class="pb-10 lg:pb-16 pt-8 lg:pt-9">
					<div class="relative aspect-[354/259] w-10/12 lg:w-full bg-transparent overflow-hidden mx-auto lg:ml-auto lg:left-12 ">
						<Customizable />
					</div>
				</div>

				<div class="text-[11px] lg:text-sm font-medium text-muted-foreground px-[14px] pb-4">
					Wide range of props for customizing
				</div>
			</div>
		</div>

    <div class="overflow-hidden rounded-card-lg border border-border shadow-card bg-[#F8F8F8] dark:bg-muted">	
      <div class="px-[7px] py-[9px] bg-transparent">		
        <h3 class="text-base lg:text-[17px] font-semibold -tracking-[0.01em] px-[14px] pt-4 lg:pt-5 text-foreground leading-[1]">Accessible</h3>

				<div class="pb-5 lg:pb-16 pt-8 lg:pt-9">
					<div class="relative aspect-[186/150] lg:aspect-[354/259] w-full bg-transparent overflow-hidden left-[30px] lg:left-14">
						<Accessible />
            <AccessibleDark />
					</div>
				</div>

				<div class="text-[11px] lg:text-sm font-medium text-muted-foreground px-[14px] pb-2 lg:pb-4">
					Components are accessible by default
				</div>
			</div>
		</div>

    <div class="overflow-hidden rounded-card-lg border border-white shadow-card bg-[#2A2A2E] dark:bg-[#3A3C42] dark:border-[#F4F4F5]/10">	
      <div class="px-[7px] py-[9px] bg-transparent">		
        <h3 class="text-base lg:text-[17px] font-semibold -tracking-[0.01em] px-[14px] pt-4 lg:pt-5 text-background dark:text-foreground leading-[1]">Consistent</h3>

				<div class="pb-5 lg:pb-16 pt-8 lg:pt-9">
					<div class="relative aspect-[186/150] lg:aspect-[354/259] w-full bg-transparent overflow-hidden left-6 lg:left-[50px]">
						<Consistent />
					</div>
				</div>

				<div class="text-[11px] lg:text-sm font-medium px-[14px] pb-2 lg:pb-4 text-white/40 dark:text-[#B0B0B3]">
					Components are as intuitive as possible
				</div>
			</div>
		</div>
	</div>
</section>

<footer class="border-t border-black/10 dark:border-foreground/10 pt-6 px-[22px] pb-10 flex justify-between">
  <div class="text-sm font-medium text-muted-foreground flex items-center gap-2 lg:gap-3"><span class="w-3 h-3 aspect-square rounded-full bg-foreground/20 block"></span>2025 Bits UI team</div>
  <ul class="flex gap-3 lg:gap-[26px] items-center justify-end">
    <li><a href="https://github.com/huntabyte/bits-ui" target="_blank" class="text-sm font-medium text-muted-foreground">Github</a></li>
    <li><a href="https://github.com/huntabyte/bits-ui/releases" target="_blank" class="text-sm font-medium text-muted-foreground">Changelog</a></li>
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
		&.dark {
			background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23B2B2B2FF' stroke-width='2' stroke-dasharray='2%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
			&:after {
				background: radial-gradient(
					83.66% 83.66% at 95.63% 5.58%,
					rgba(255, 255, 255, 0) 0%,
					#171717 100%
				);
			}
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
		&.dark {
			background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='200' ry='200' stroke='%23B2B2B2FF' stroke-width='2' stroke-dasharray='2%2c8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
			&:after {
				background: radial-gradient(
					84.28% 84.28% at 40.53% 20.39%,
					rgba(255, 255, 255, 0) 0%,
					#171717 100%
				);
			}
		}
	}
  .dotted_bg{
    //background-image: radial-gradient(#DEDEDE 1px, transparent 0);
    background-size: 15px 15px;
    background-position: 0px 0px;
  }
</style>
