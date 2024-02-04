export const context = $state({
	layersRoot: new Set<HTMLElement>(),
	layersWithOutsidePointerEventsDisabled: new Set<HTMLElement>(),
	branches: new Set<HTMLElement>(),
});
