type FocusTarget = string | HTMLElement | SVGElement | null;

type FocusProp = FocusTarget | ((el?: HTMLElement) => FocusTarget);
