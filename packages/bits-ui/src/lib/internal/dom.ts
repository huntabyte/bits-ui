export function clearSelection() {
	if (window.getSelection) {
		// eslint-disable-next-line ts/no-explicit-any
		const selection: any = window.getSelection() ?? {};

		if (selection.empty) {
			selection.empty();
		} else if (
			selection.removeAllRanges &&
			selection.rangeCount > 0 &&
			selection.getRangeAt(0).getClientRects().length > 0
		) {
			selection.removeAllRanges();
		}
	}
}

export function getSelection(): string | undefined {
	// eslint-disable-next-line ts/no-explicit-any
	if (window.getSelection) return (window.getSelection() as any).toString();
	// eslint-disable-next-line ts/no-explicit-any
	else if (document.getSelection) return (document.getSelection() as any).toString();
	return undefined;
}
