<script lang="ts" module>
	import { LinkPreview, type WithoutChildrenOrChild } from "bits-ui";
	export type LinkPreviewForceMountTestProps = LinkPreview.RootProps & {
		contentProps?: WithoutChildrenOrChild<LinkPreview.ContentProps>;
		portalProps?: WithoutChildrenOrChild<LinkPreview.PortalProps>;
		withOpenCheck?: boolean;
	};
</script>

<script lang="ts">
	let {
		open = false,
		contentProps,
		portalProps,
		withOpenCheck = false,
		...restProps
	}: LinkPreviewForceMountTestProps = $props();
</script>

<main data-testid="main">
	<LinkPreview.Root bind:open {...restProps} openDelay={50} closeDelay={50}>
		<LinkPreview.Trigger
			data-testid="trigger"
			href="https://github.com/sveltejs"
			target="_blank"
			rel="noreferrer noopener"
		>
			@sveltejs
		</LinkPreview.Trigger>
		<LinkPreview.Portal {...portalProps}>
			{#if withOpenCheck}
				<LinkPreview.Content
					data-testid="content"
					class="w-80"
					{...contentProps}
					forceMount
				>
					{#snippet child({ props, open })}
						{#if open}
							<div {...props}>Content</div>
						{/if}
					{/snippet}
				</LinkPreview.Content>
			{:else}
				<LinkPreview.Content
					data-testid="content"
					class="w-80"
					{...contentProps}
					forceMount
				>
					{#snippet child({ props, open: _open })}
						<div {...props}>Content</div>
					{/snippet}
				</LinkPreview.Content>
			{/if}
		</LinkPreview.Portal>
	</LinkPreview.Root>
	<button data-testid="binding" onclick={() => (open = !open)}>{open}</button>
	<div data-testid="outside">outside</div>
</main>
<div data-testid="portal-target" id="portal-target"></div>
