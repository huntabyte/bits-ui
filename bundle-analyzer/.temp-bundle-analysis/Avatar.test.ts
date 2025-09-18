import { Avatar } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestAvatarComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Avatar.Root,
	Avatar.Image,
	Avatar.Fallback
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Avatar.Root,
	Avatar.Image,
	Avatar.Fallback
	];
