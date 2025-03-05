<script lang="ts">
	import { Accordion } from "bits-ui";
</script>

<Accordion.Root type="single">
	<Accordion.Item value="item-1">
		<Accordion.Trigger>Section 1</Accordion.Trigger>
		<Accordion.Content>Content for section 1</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<Accordion.Trigger>Section 2</Accordion.Trigger>
		<Accordion.Content>Content for section 2</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>

<style>
	/* Base styles */
	:global([data-accordion-item]) {
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		margin-bottom: 0.5rem;
	}

	/* Trigger styles based on state */
	:global([data-accordion-trigger]) {
		width: 100%;
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	:global([data-accordion-trigger][data-state="open"]) {
		background-color: #f7fafc;
		border-bottom: 1px solid #e2e8f0;
	}

	/* Content styles */
	:global([data-accordion-content]) {
		overflow: hidden;
		transition: height 300ms ease-out;
	}

	/* Define keyframes for opening animation */
	@keyframes -global-accordionOpen {
		0% {
			height: 0;
			opacity: 0;
		}
		80% {
			height: var(--bits-accordion-content-height);
			opacity: 0.8;
		}
		100% {
			height: var(--bits-accordion-content-height);
			opacity: 1;
		}
	}

	/* Define keyframes for closing animation */
	@keyframes -global-accordionClose {
		0% {
			height: var(--bits-accordion-content-height);
			opacity: 1;
		}
		20% {
			height: var(--bits-accordion-content-height);
			opacity: 0.8;
		}
		100% {
			height: 0;
			opacity: 0;
		}
	}

	/* Apply animations based on state */
	:global([data-accordion-content][data-state="open"]) {
		animation: accordionOpen 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	:global([data-accordion-content][data-state="closed"]) {
		animation: accordionClose 300ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
	}
</style>
