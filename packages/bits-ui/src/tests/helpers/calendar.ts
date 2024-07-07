export function getSelectedDays(calendar: HTMLElement) {
	return Array.from(calendar.querySelectorAll<HTMLElement>("[data-calendar-day][data-selected]"));
}

export function getSelectedDay(calendar: HTMLElement) {
	return calendar.querySelector<HTMLElement>("[data-calendar-day][data-selected]") as HTMLElement;
}
