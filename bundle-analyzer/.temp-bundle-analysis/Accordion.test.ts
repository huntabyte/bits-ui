import { Accordion } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestAccordionComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Accordion.Root,
	Accordion.Item,
	Accordion.Header,
	Accordion.Trigger,
	Accordion.Content
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Accordion.Root,
	Accordion.Item,
	Accordion.Header,
	Accordion.Trigger,
	Accordion.Content
	];
