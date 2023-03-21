import type { Lanyard } from "@/types/lanyard";

export function convert(activity: Lanyard["activities"][number], type: "large" | "small") {
	const url = activity.assets?.[(type + "_image") as keyof typeof activity.assets];

	if (url?.startsWith("mp:external/")) {
		return `https://media.discordapp.net/external/${url.replace("mp:external/", "")}`;
	} else {
		return `https://cdn.discordapp.com/app-assets/${activity?.id}/${activity?.assets?.small_image}.webp`;
	}
}
