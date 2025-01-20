type TProfile = {
  _id: number;
  user_id: string;
  name: string;
  age: number;
  bio: string;
  gender: string;
  hobbies: string[];
  imgs: string[];
  is_complete_profile: boolean;
  purposeValue: string | null;
  locate?: { type: string; coordinates: number[] };
  location: string | null;
  genderFind: string | null;
  ageRange: number[] | null;
};
