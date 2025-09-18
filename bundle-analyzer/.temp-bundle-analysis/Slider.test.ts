import { Slider } from "bits-ui";

// test component that uses all exports to ensure they're included in bundle
export function TestSliderComponent() {
	// reference all exports to prevent tree-shaking
	const refs = [
		Slider.Root,
	Slider.Range,
	Slider.Thumb,
	Slider.Tick,
	Slider.TickLabel,
	Slider.ThumbLabel
	];
	return refs;
}

// ensure all exports are referenced to prevent tree-shaking
export const allExports = [
	Slider.Root,
	Slider.Range,
	Slider.Thumb,
	Slider.Tick,
	Slider.TickLabel,
	Slider.ThumbLabel
	];
