const ROOT_ATTR = "data-label-root";

class LabelRootState {
	constructor() {}

	#onmousedown = (e: MouseEvent) => {
		if (e.detail > 1) e.preventDefault();
	};

	props = $derived({
		[ROOT_ATTR]: "",
		onmousedown: this.#onmousedown,
	});
}

export function setLabelRootState() {
	return new LabelRootState();
}
