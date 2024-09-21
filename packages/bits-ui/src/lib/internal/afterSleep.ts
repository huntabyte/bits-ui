export function afterSleep(ms: number, cb: () => void) {
	setTimeout(cb, ms);
}
