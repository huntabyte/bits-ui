import { PinInput } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestPinInputComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		PinInput.Root,
	PinInput.Cell
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	PinInput.Root,
	PinInput.Cell
	];
