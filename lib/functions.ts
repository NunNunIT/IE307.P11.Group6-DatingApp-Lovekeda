type TPosition = {
  lat: number;
  long: number;
}

export function isNotNullAndUndefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function haversineDistance(
  loc1?: Partial<TPosition>,
  loc2?: Partial<TPosition>
): number | undefined {
  if (
    !isNotNullAndUndefined(loc1?.lat) ||
    !isNotNullAndUndefined(loc1?.long) ||
    !isNotNullAndUndefined(loc2?.lat) ||
    !isNotNullAndUndefined(loc2?.long)
  ) return undefined;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((loc1.lat - loc2.lat) * Math.PI) / 180;
  const dLon = ((loc1.long - loc2.long) * Math.PI) / 180;
  const a =
    Math.cos((loc1.lat * Math.PI) / 180) *
    Math.cos((loc2.lat * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2) +
    Math.sin(dLat / 2) * Math.sin(dLat / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}