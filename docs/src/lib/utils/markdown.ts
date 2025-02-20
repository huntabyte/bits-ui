export function parseMarkdown(text: string) {
	return text
		.replace(/`([^`]+)`/g, "<Code neutral class='text-[12px]!'>$1</Code>")
		.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
		.replace(/\*([^*]+)\*/g, "<em>$1</em>")
		.replace(/_([^_]+)_/g, "<em>$1</em>")
		.replace(/~~([^~]+)~~/g, "<del>$1</del>")
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a class='link' href='$2'>$1</a>")
		.replace(/&gt;([^>]+)\n/g, "<blockquote>$1</blockquote>")
		.replace(/\n/g, "<br />");
}

export function parseTypeDef(text: string) {
	return text.replace(/\n/g, "<br />");
}
