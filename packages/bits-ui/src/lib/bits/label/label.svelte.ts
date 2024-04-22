class LabelRootState {
	constructor() {}

	#onmousedown = (e: MouseEvent) => {
		if (e.detail > 1) e.preventDefault();
	};

	props = $derived({
		"data-label-root": "",
		onmousedown: this.#onmousedown,
	});
}

export function setLabelRootState() {
	return new LabelRootState();
}
