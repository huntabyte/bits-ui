import { RatingGroup } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestRatingGroupComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		RatingGroup.Root,
	RatingGroup.Item
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	RatingGroup.Root,
	RatingGroup.Item
	];
