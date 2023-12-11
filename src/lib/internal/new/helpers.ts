export function getDataDisabled(disabled: boolean) {
	return disabled ? "" : undefined;
}

export function getAriaDisabled(disabled: boolean) {
	return disabled ? "true" : "false";
}

export function getDataOpenClosed(open: boolean) {
	return open ? "open" : "closed";
}
