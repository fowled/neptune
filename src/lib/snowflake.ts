export function snowflake(snowflake?: number) {
	const epoch = 1420070400000;

	if (!snowflake) {
		return;
	}

	return new Date(Number(BigInt(snowflake) >> 22n) + epoch).toLocaleDateString("en-us", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
