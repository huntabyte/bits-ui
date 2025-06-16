<script lang="ts">
	import { Dialog } from "bits-ui";
	import type { DialogTestProps } from "../dialog/dialog-test.svelte";

	let {
		open = false,
		contentProps = {},
		portalProps = {},
		titleProps = {},
		descriptionProps = {},
		withOpenCheck = false,
		...restProps
	}: DialogTestProps = $props();
</script>

<main>
	<Dialog.Root bind:open {...restProps}>
		<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
		<Dialog.Portal {...portalProps}>
			{#if withOpenCheck}
				<Dialog.Overlay
					forceMount
					data-testid="overlay"
					class="fixed inset-0 h-[100vh] w-[100vw] bg-black"
				>
					{#snippet child({ props, open })}
						{#if open}
							<div {...props}></div>
						{/if}
					{/snippet}
				</Dialog.Overlay>
			{:else}
				<Dialog.Overlay
					forceMount
					data-testid="overlay"
					class="fixed inset-0 h-[100vh] w-[100vw] bg-black"
				>
					{#snippet child({ props, open: _open })}
						<div {...props}></div>
					{/snippet}
				</Dialog.Overlay>
			{/if}
			{#if withOpenCheck}
				<Dialog.Content
					forceMount
					{...contentProps}
					data-testid="content"
					class="tranlate-x-[50%] fixed left-[50%] top-[50%] translate-y-[50%] bg-white p-1"
				>
					{#snippet child({ props, open })}
						{#if open}
							<div {...props}>
								<Dialog.Title {...titleProps} data-testid="title"
									>title</Dialog.Title
								>
								<Dialog.Description {...descriptionProps} data-testid="description">
									description
								</Dialog.Description>
								<Dialog.Close data-testid="close">close</Dialog.Close>
								<button id="open-focus-override" data-testid="open-focus-override">
									open focus override
								</button>
							</div>
						{/if}
					{/snippet}
				</Dialog.Content>
			{:else}
				<Dialog.Content
					forceMount
					{...contentProps}
					data-testid="content"
					class="tranlate-x-[50%] fixed left-[50%] top-[50%] translate-y-[50%] bg-white p-1"
				>
					{#snippet child({ props, open: _open })}
						<div {...props}>
							<Dialog.Title {...titleProps} data-testid="title">title</Dialog.Title>
							<Dialog.Description {...descriptionProps} data-testid="description">
								description
							</Dialog.Description>
							<Dialog.Close data-testid="close">close</Dialog.Close>
							<button id="open-focus-override" data-testid="open-focus-override">
								open focus override
							</button>
						</div>
					{/snippet}
				</Dialog.Content>
			{/if}
		</Dialog.Portal>
	</Dialog.Root>
	<p data-testid="binding">{open}</p>
	<button data-testid="toggle" onclick={() => (open = !open)}>toggle</button>
	<button id="close-focus-override" data-testid="close-focus-override">
		close focus override
	</button>
	<div id="portalTarget" data-testid="portalTarget"></div>
</main>
