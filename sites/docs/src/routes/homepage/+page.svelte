<script lang="ts">
	import "$lib/styles/app.postcss";
	import { Button, Tabs } from "bits-ui";
	import Sparkle from "phosphor-svelte/lib/Sparkle";
  import CardSound from "$lib/components/homepage/CardSound.svelte";
	
	import { Logo } from "$icons/index.js";
	import LightSwitch from "$lib/components/light-switch.svelte";
  import HomeSlider from "$lib/components/homepage/HomeSlider.svelte";
  import HomeCombobox from "$lib/components/homepage/HomeCombobox.svelte";
  import HomeSwitch from "$lib/components/homepage/HomeSwitch.svelte";
  
	</script>

<header class="grid grid-cols-3 px-5 py-[17px]">
	<a
		href="/"
		class="ml-2 mt-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	>
		<Logo />
	</a>

	<nav class="mt-2 text-center">
		<ul>
			<li class="active"><a href="/">Home</a></li>
			<li><a href="/">Showcase</a></li>
			<li><a href="/">Docs</a></li>
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

<section>
	<div class="mx-auto w-1/2 text-center">
		<a
			href="/"
			class="inline-flex gap-2 rounded-card-lg border border-border-input py-1.5 pl-3 pr-4 shadow-mini"
		>
			<Sparkle class="size-4" aria-label="Stars" />
			<span
				class="inline-block border-l border-l-border-input pl-3 text-[13px] font-medium text-foreground"
				>New Svelte 5 version</span
			>
		</a>
		<h1>Build your own amazing UI elements</h1>
		<p class="mx-auto w-9/12 font-medium text-muted-foreground">
			Bits UI is a collection of headless component primitives that enable you to build your
			own custom components.
		</p>
		<Button.Root
			class="inline-flex h-10 items-center justify-center rounded-input bg-dark
      px-3 shadow-mini
      hover:bg-dark/95 active:scale-98 active:transition-all"
		>
			<kbd
				class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background-alt px-1.5 font-mono text-[10px] font-medium opacity-100 shadow-kbd sm:flex"
			>
				<span class="text-xs">S</span>
			</kbd>
			<span class="ml-4 mr-3 text-[15px] font-semibold text-background">Start building</span>
		</Button.Root>
	</div>

  <div class="grid grid-cols-4">
    
      <CardSound/>
    
    <div class="border">
      <HomeSlider/>
    </div>
    <div class="border">
      <Tabs.Root value="follow">
        <Tabs.List>
          <Tabs.Trigger value="follow" class="">Follow</Tabs.Trigger>
          <Tabs.Trigger value="other" class="">Other</Tabs.Trigger>
        </Tabs.List>
    
        <Tabs.Content value="follow" class="select-none">follow</Tabs.Content>
        <Tabs.Content value="other" class="select-none">other</Tabs.Content>
      </Tabs.Root>
    </div>
    <div class="border">
      <HomeCombobox/>
      <HomeSwitch/>
    </div>
  </div>


  
</section>

<style lang="postcss">
	header {
		nav {
			li {
				display: inline-block;
				a {
					font-size: 14px;
					letter-spacing: 0.01em;
					line-height: 1;
					font-weight: 500;
					-webkit-font-smoothing: antialiased;
					border-radius: 40px;
					padding: 0.3em 0.9em 0.4em 0.9em;
					color: hsl(var(--foreground) / 0.5);
				}
				&.active {
					a {
						background: rgba(0, 0, 0, 0.05);
						color: hsl(var(--foreground));
					}
				}
			}
		}
	}

	section {
		height: calc(100svh - 76px); /* header height */
		min-height: 700px;
		padding-top: 7em;
	}
	h1 {
		text-wrap: balance;
		font-size: clamp(3.125rem, 3.6vw + 1rem, 5rem);
		line-height: 102%;
		margin-bottom: 0.35em;
		margin-top: 0.2em;
	}
	p {
		font-size: 1.125rem;
		line-height: 144%;
		margin-bottom: 2em;
	}
</style>
