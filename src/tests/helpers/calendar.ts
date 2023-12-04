export function getSelectedDays(calendar: HTMLElement) {
	return Array.from(calendar.querySelectorAll<HTMLElement>("[data-selected]"));
}

export function getSelectedDay(calendar: HTMLElement) {
	return calendar.querySelector<HTMLElement>("[data-selected]") as HTMLElement;
}
