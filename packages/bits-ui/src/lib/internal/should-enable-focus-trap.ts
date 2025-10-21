export function shouldEnableFocusTrap({
	forceMount,
	open,
}: {
	forceMount: boolean;
	open: boolean;
}): boolean {
	if (forceMount) return open;
	return open;
}
