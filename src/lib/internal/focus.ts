import { isBrowser } from "./index.js";

/**
 * Handles `initialFocus` prop behavior for the
 * Calendar & RangeCalendar components.
 */
export function handleCalendarInitialFocus(calendar: HTMLElement) {
	if (!isBrowser) return;
	const selectedDay = calendar.querySelector<HTMLElement>("[data-selected]");
	if (selectedDay) return focusWithoutScroll(selectedDay);

	const today = calendar.querySelector<HTMLElement>("[data-today]");
	if (today) return focusWithoutScroll(today);

	const firstDay = calendar.querySelector<HTMLElement>("[data-calendar-date]");
	if (firstDay) return focusWithoutScroll(firstDay);
}

export function focusWithoutScroll(element: HTMLElement) {
	const scrollPosition = {
		x: window.pageXOffset || document.documentElement.scrollLeft,
		y: window.pageYOffset || document.documentElement.scrollTop,
	};
	element.focus();
	window.scrollTo(scrollPosition.x, scrollPosition.y);
}
