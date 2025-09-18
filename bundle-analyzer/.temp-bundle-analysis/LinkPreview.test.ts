import { LinkPreview } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestLinkPreviewComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		LinkPreview.Arrow,
	LinkPreview.Root,
	LinkPreview.Content,
	LinkPreview.Trigger,
	LinkPreview.Portal,
	LinkPreview.ContentStatic
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	LinkPreview.Arrow,
	LinkPreview.Root,
	LinkPreview.Content,
	LinkPreview.Trigger,
	LinkPreview.Portal,
	LinkPreview.ContentStatic
	];
