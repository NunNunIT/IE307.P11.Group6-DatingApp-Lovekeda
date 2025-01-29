export const LOCATION_API_URL_UNFORMATTED = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={}&lon={}` as const;
export const SECRET_KEY = 'secret_key' as const;

export enum ENUM_USER_GENDER {
  Male = "male",
  Female = "female",
  Other = "other"
}