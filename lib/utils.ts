import { LOCATION_API_URL_UNFORMATTED } from '@/constant';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getRelativeLocation(
  coordinates: [number, number],
): Promise<any> {
  const LOCATION_API_URL: string =
    LOCATION_API_URL_UNFORMATTED
      .replace("{}", coordinates[0].toString())
      .replace("{}", coordinates[1].toString())
    + "&zoom=13"
    + `&accept-language=vi`;

  try {
    const res = await fetch(LOCATION_API_URL);
    if (!res.ok) throw new Error("Failed to fetch location");
    const payload = await res.json();
    console.log("🚀 ~ payload:", payload)
    return payload;
  } catch (error: unknown) {
    console.log(">> Error in getRelativeLocation", error instanceof Error ? error.message : "unknown error");
    return null;
  }
}