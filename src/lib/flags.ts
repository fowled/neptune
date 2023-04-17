export function getBadges(publicFlags: number) {
	const flags = [
		{ name: "staff", value: 1 << 0, display: "Discord Staff" },
		{ name: "partner", value: 1 << 1, display: "Partnered Server Owner" },
		{ name: "certified_moderator", value: 1 << 18, display: "Moderator Program Alumni" },
		{ name: "hypesquad", value: 1 << 2, display: "HypeSquad Events" },
		{ name: "bravery", value: 1 << 6, display: "HypeSquad Bravery" },
		{ name: "brilliance", value: 1 << 7, display: "HypeSquad Brilliance" },
		{ name: "balance", value: 1 << 8, display: "HypeSquad Balance" },
		{ name: "bug_hunter_one", value: 1 << 3, display: "Bug Hunter" },
		{ name: "bug_hunter_two", value: 1 << 14, display: "Bug Hunter" },
		{ name: "verified_bot", value: 1 << 16, display: "Verified Bot" },
		{ name: "active_developer", value: 1 << 22, display: "Active Developer" },
		{ name: "verified_developer", value: 1 << 17, display: "Early Verified Bot Developer" },
		{ name: "early_supporter", value: 1 << 9, display: "Early Supporter" }
	];

	const badges = [];

	for (const flag of flags) {
		if ((flag.value & publicFlags) === flag.value) {
			badges.push({ name: flag.name, display: flag.display });
		}
	}

	const nitroSub = new Date("8/8/2021");
	const startedBoosting = new Date("7/5/2022");

	const displayOptions = { month: "short", day: "numeric", year: "numeric" } as const;

	badges.push(
		{ name: "nitro", display: `Subscriber since ${nitroSub.toLocaleDateString("en-US", displayOptions)}` },
		{
			name: "boost_" + monthDiff(startedBoosting, new Date()),
			display: `Server boosting since ${startedBoosting.toLocaleDateString("en-US", displayOptions)}`
		}
	);

	return badges;
}

function monthDiff(dateFrom: Date, dateTo: Date) {
	return dateTo.getMonth() - dateFrom.getMonth() + 12 * (dateTo.getFullYear() - dateFrom.getFullYear());
}
