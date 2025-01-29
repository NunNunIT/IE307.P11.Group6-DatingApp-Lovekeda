import { LOCATION_API_URL_UNFORMATTED } from "@/utils/constants";
import { badRequestResponse, errorResponse, successfulResponse } from "@/utils/handlers";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  let lat = Number(searchParams.get("lat"));
  let long = Number(searchParams.get("long"));
  if (!lat || !long || isNaN(lat) || isNaN(long)) {
    return badRequestResponse({ message: "Invalid latitude or longitude" });
  }

  try {
    const LOCATION_API_URL: string =
      LOCATION_API_URL_UNFORMATTED
        .replace("{}", lat.toString())
        .replace("{}", long.toString())
      + "&zoom=13"
      + `&accept-language=vi`;
    const res = await fetch(LOCATION_API_URL);
    if (!res.ok) throw new Error("Failed to fetch location data");
    const data = await res.json();
    return successfulResponse({ data });
  } catch (error) {
    return errorResponse({ message: error instanceof Error ? error?.message : "Unknown error" });
  }
}
