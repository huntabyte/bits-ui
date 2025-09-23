export function getSelectedDays(calendar: HTMLElement | Element) {
	return Array.from(calendar.querySelectorAll<HTMLElement>("[data-bits-day][data-selected]"));
}

export function getSelectedDay(calendar: HTMLElement | Element) {
	return calendar.querySelector<HTMLElement>("[data-bits-day][data-selected]") as HTMLElement;
}
