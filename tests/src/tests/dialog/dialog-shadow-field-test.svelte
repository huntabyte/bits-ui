<script lang="ts">
	import { Dialog } from "bits-ui";
	import type { DialogTestProps } from "./dialog-test.svelte";

	let { contentProps = {} }: DialogTestProps = $props();

	// a "web component" with an input inside its open shadow root
	function shadowField(host: HTMLElement) {
		const input = document.createElement("input");
		input.dataset.testid = "shadow-input";
		host.attachShadow({ mode: "open" }).appendChild(input);
	}
</script>

<Dialog.Root>
	<Dialog.Trigger data-testid="trigger">open</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Content data-testid="content" {...contentProps}>
			<Dialog.Title>title</Dialog.Title>
			<button data-testid="light" tabindex="0">light</button>
			<div data-testid="shadow-host" {@attach shadowField}></div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
