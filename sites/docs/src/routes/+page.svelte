<script lang="ts">
	import "$lib/styles/app.postcss";
	import { Button } from "bits-ui";
	import Sparkle from "phosphor-svelte/lib/Sparkle";
  import SlidersHorizontal from "phosphor-svelte/lib/SlidersHorizontal";
  import Keyboard from "phosphor-svelte/lib/Keyboard";
  import Stack from "phosphor-svelte/lib/Stack";
	import CardAir from "$lib/components/homepage/card-air.svelte";
	import CardSound from "$lib/components/homepage/card-sound.svelte";
	import CardTimer from "$lib/components/homepage/card-timer.svelte";
	import CardToggle from "$lib/components/homepage/card-toggle.svelte";
	import { Logo } from "$icons/index.js";
	import LightSwitch from "$lib/components/light-switch.svelte";

  import Customizable from "$lib/components/homepage/svg-customizable.svelte";
  import Accessible from "$lib/components/homepage/svg-accessible.svelte";
  import Consistent from "$lib/components/homepage/svg-consistent.svelte";
</script>

<div class="border-b border-solid border-black/10 bg-[#f5f5f5]/30">
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
				href="/docs"
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
				href="/docs"
				class="inline-flex gap-2 rounded-card-lg border border-border-input py-1.5 pl-3 pr-4 shadow-mini bg-white"
			>
				<Sparkle class="mt-[2px] size-4" aria-label="Stars" />
				<span
					class="inline-block border-l border-l-border-input pl-3 text-[13px] font-medium text-foreground"
					>New Svelte 5 version</span
				>
			</a>
			<h1
				class="font-['Cal_Sans'] mb-[0.35em] mt-[0.2em] text-balance pb-[0.1em] text-[4.25rem] font-semibold leading-[102%] antialiased text-transparent selection:text-foreground"
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
				href="/docs"
			>
				<kbd
					class="shadow-[0px_2px_0px_0px_#59595b] pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background-alt px-1.5 font-mono text-xxs font-medium opacity-100 sm:flex"
				>
					<span class="text-xs text-foreground-alt">S</span>
				</kbd>
				<span class="ml-4 mr-3 text-[14px] font-semibold tracking-[0.01em] text-background leading-[1]"
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

<section class="w-10/12 mx-auto mt-20 mb-44">
  <h2 class=" text-foreground w-1/3 text-balance mb-10">
    <small class="border border-foreground rounded-3xl text-[13px] tracking-[0.01em] px-2 py-[3px] font-medium"><span class="inline-block w-[10px] h-[10px] rounded-full bg-foreground/90 mr-3"/>Explore</small>
    <span class="block tracking-[0.02em] text-[32px] font-semibold font-['Cal_Sans'] leading-[118%] mt-2">Main benefits of using our headless collection</span>
  </h2>
  <div class="grid grid-cols-3 gap-x-[15px] ">

    <div class="border border-border rounded-card-lg  shadow-card overflow-hidden">
      <div class="bg-background rounded-15px mx-2 my-[10px] pl-6 pr-2 pt-2 pb-5">
        <div class="flex items-center justify-between ">
          <h3 class="font-semibold text-[17px] -tracking-[0.01em]">Customizable</h3>
          <div class="inline-flex w-[50px] h-[50px] rounded-full items-center justify-center bg-foreground">
            <SlidersHorizontal class="text-background size-6"/>
          </div>
        </div>
  
        <div class="pt-9 pb-16">
          <div class="relative w-full aspect-[388/295] bg-transparent left-[18px]">
            <Customizable />
          </div>
        </div>

        <div class="font-medium text-sm text-muted-foreground">Wide range of props for customizing </div>
      </div>
    </div>

    <div class="rounded-card-lg  shadow-card overflow-hidden">
      <div class="bg-[#F8F8F8] rounded-15px pl-8 pr-4 pt-[18px] pb-[30px]">
        <div class="flex items-center justify-between ">
          <h3 class="font-semibold text-[17px] -tracking-[0.01em]">Accessible</h3>
          <div class="inline-flex w-[50px] h-[50px] rounded-full items-center justify-center bg-foreground">
            <Keyboard class="text-background size-6"/>
          </div>
        </div>
  
        <div class="pt-9 pb-16">
          <div class="relative w-full aspect-[388/295] bg-transparent left-[18px]">
            <Accessible />
          </div>
        </div>

        <div class="font-medium text-sm text-muted-foreground">Components are accessible by default</div>
      </div>
    </div>

    <div class="rounded-card-lg  shadow-card overflow-hidden">
      <div class="bg-foreground rounded-15px pl-8 pr-4 pt-[18px] pb-[30px]">
        <div class="flex items-center justify-between ">
          <h3 class="font-semibold text-[17px] -tracking-[0.01em] text-background">Consistent</h3>
          <div class="inline-flex w-[50px] h-[50px] rounded-full items-center justify-center bg-background">
            <Stack class="text-foreground size-6"/>
          </div>
        </div>
  
        <div class="pt-9 pb-16">
          <div class="relative w-full aspect-[388/295] bg-transparent left-[18px]">
            <Consistent />
          </div>
        </div>

        <div class="font-medium text-sm text-background/40">Components are as intuitive as possible</div>
      </div>
    </div>
  </div>
</section>

<style lang="postcss">

	h1 {
		background: linear-gradient(
				180deg,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0) 41.43%
			),
			#272727;
    background-clip: text;
    font-weight: 600;
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

</style>
