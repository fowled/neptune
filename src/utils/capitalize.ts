export function capitalize<T extends string>(string: T) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
