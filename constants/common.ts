export const BACKEND_API_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL as string || 'https://lovekeda-api.vercel.app/api';
export const SECRET_KEY = process.env.EXPO_PUBLIC_SECRET_KEY as string;

export const GENDER_OPTIONS = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
] as const;

export const SEARCH_GENDER_OPTIONS = [
  ...GENDER_OPTIONS.slice(0, 2),
  { label: "Tất cả", value: "all" },
] as const;