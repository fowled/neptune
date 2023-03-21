export function timestamp(timestamp: number) {
	const parse = new Date(timestamp);

	const [hours, minutes, seconds] = [
		parse.getUTCHours().toString(),
		parse.getUTCMinutes().toString(),
		parse.getUTCSeconds().toString()
	].map((el) => (el.toString().length === 1 ? (el = `0${el}`) : el));

	if (parseInt(hours) !== 0) {
		return `${hours}:${minutes}:${seconds}`;
	} else {
		return `${minutes}:${seconds}`;
	}
}
