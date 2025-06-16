export function shouldEnableFocusTrap({
	forceMount,
	present,
	open,
}: {
	forceMount: boolean;
	present: boolean;
	open: boolean;
}): boolean {
	if (forceMount) return open;
	return present && open;
}
