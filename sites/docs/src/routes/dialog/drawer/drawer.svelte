<script lang="ts">
	import type { Snippet } from "svelte";
	import { Dialog, type WithoutChild } from "bits-ui";

	import Overlay from "./drawer-overlay.svelte";
	import Content from "./drawer-content.svelte";
	import ContentFix from "./drawer-content-fix.svelte";

	type Props = Dialog.RootProps & {
		trigger: Snippet<[boolean]>;
		title?: Snippet;
		description?: Snippet;
		contentProps?: WithoutChild<Dialog.ContentProps>;
	};

	let {
		open = $bindable(false),
		children,
		trigger,
		contentProps,
		title,
		description,
		...restProps
	}: Props = $props();
</script>

<Dialog.Root {...restProps} bind:open>
	<Dialog.Trigger>
		{@render trigger?.(open)}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Overlay duration={200} />
		<!-- <ContentFix duration={200}> -->
		<Content duration={200}>
			{#snippet children()}
				<header>
					<div>
						<Dialog.Title>
							{@render title?.()}
						</Dialog.Title>
						<Dialog.Description>
							{@render description?.()}
						</Dialog.Description>
					</div>
					<Dialog.Close>close</Dialog.Close>
				</header>

				{@render children?.()}
			{/snippet}
		</Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}
</style>
