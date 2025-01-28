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

export const HOBBY_OPTIONS = [
  { label: "Sở thích 1", value: "hobby 1" },
  { label: "Sở thích 2", value: "hobby 2" },
  { label: "Sở thích 3", value: "hobby 3" },
  { label: "Sở thích 4", value: "hobby 4" },
  { label: "Sở thích 5", value: "hobby 5" },
  { label: "Sở thích 6", value: "hobby 6" },
  { label: "Nấu ăn", value: "cook" },
  { label: "Âm nhạc", value: "music" },
  { label: "Mua sắm", value: "shopping" },
  { label: "Ngủ", value: "sleep" },
  { label: "Xem phim", value: "movie" },
  { label: "Đọc sách", value: "reading" },
  { label: "Chụp ảnh", value: "photography" },
  { label: "Du lịch", value: "travel" },
  { label: "Hội họa", value: "painting" },
  { label: "Thể dục thể thao", value: "sports" },
  { label: "Làm vườn", value: "gardening" },
  { label: "Chơi game", value: "gaming" },
  { label: "Viết lách", value: "writing" },
  { label: "Học ngoại ngữ", value: "language learning" },
  { label: "Chơi nhạc cụ", value: "instrument" },
  { label: "Câu cá", value: "fishing" },
  { label: "Leo núi", value: "hiking" },
  { label: "Yoga", value: "yoga" },
  { label: "Tập gym", value: "gym" },
  { label: "Cắm trại", value: "camping" },
  { label: "Thiền", value: "meditation" },
  { label: "Khiêu vũ", value: "dancing" },
  { label: "Sưu tầm đồ cổ", value: "antique collecting" },
  { label: "Xếp hình", value: "puzzle" },
] as const;
