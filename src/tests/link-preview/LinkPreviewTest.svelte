<script lang="ts">
	import { LinkPreview } from "$lib";

	type $$Props = LinkPreview.Props;

	export let open: $$Props["open"] = false;
</script>

<main data-testid="main">
	<LinkPreview.Root bind:open {...$$restProps} openDelay={50} closeDelay={50}>
		<LinkPreview.Trigger
			data-testid="trigger"
			href="https://github.com/sveltejs"
			target="_blank"
			rel="noreferrer noopener"
			class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
		>
			@sveltejs
		</LinkPreview.Trigger>
		<LinkPreview.Content data-testid="content" class="w-80"
			>Content</LinkPreview.Content
		>
	</LinkPreview.Root>
	<button data-testid="binding" on:click={() => (open = !open)}>{open}</button>
	<div data-testid="outside">outside</div>
</main>
<div data-testid="portal-target" id="portal-target" />
