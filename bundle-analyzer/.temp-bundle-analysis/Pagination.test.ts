import { Pagination } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestPaginationComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Pagination.Root,
	Pagination.PrevButton,
	Pagination.NextButton,
	Pagination.Page
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Pagination.Root,
	Pagination.PrevButton,
	Pagination.NextButton,
	Pagination.Page
	];
