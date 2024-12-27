import { LOCATION_API_URL_UNFORMATTED } from '@/constant';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export async function getRelativeLocation(
  coordinates: [number, number],
  maxRetries = 3,
  delay = 1000
): Promise<any> {
  const LOCATION_API_URL: string =
    LOCATION_API_URL_UNFORMATTED
      .replace("{}", coordinates[0].toString())
      .replace("{}", coordinates[1].toString())
    + "&zoom=13"
    + `&accept-language=vi`;

  async function fetchWithRetry(url: string, retries: number): Promise<any> {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch location");
      const payload = await res.json();
      return payload;
    } catch (error: unknown) {
      if (retries > 0) {
        console.log(`Retrying... (${maxRetries - retries + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(url, retries - 1);
      }
      console.log(
        ">> Error in getRelativeLocation",
        error instanceof Error ? error.message : "unknown error"
      );
      return null;
    }
  }

  return fetchWithRetry(LOCATION_API_URL, maxRetries);
}
