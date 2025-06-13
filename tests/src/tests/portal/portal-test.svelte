<script lang="ts">
	import { Portal, type PortalProps } from "bits-ui";

	let {
		to,
		disabled,
		includeTargets = true,
		content = "Portal Content",
	}: PortalProps & { includeTargets?: boolean; content?: string } = $props();

	let customElement = $state<HTMLElement | null>(null);
	let documentFragment: DocumentFragment | null = null;

	if (typeof document !== "undefined") {
		documentFragment = document.createDocumentFragment();
		const container = document.createElement("div");
		container.setAttribute("data-testid", "fragment-container");
		documentFragment.appendChild(container);
	}
</script>

<div data-testid="main-container">
	<Portal {to} {disabled}>
		<div data-testid="portal-content" data-content={content}>
			{content}
		</div>
	</Portal>

	{#if includeTargets}
		<div data-testid="custom-target" bind:this={customElement}></div>

		<div id="string-target" data-testid="string-target"></div>
		<div class="class-target" data-testid="class-target"></div>

		<div data-testid="fragment-host"></div>
	{/if}
</div>

<div data-testid="outside-portal">Outside portal</div>
