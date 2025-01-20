type TProfile = {
  _id: number;
  user_id: string | null;
  name: string | null;
  age: number | null;
  bio: string | null;
  gender: string | null;
  hobbies: string[] | null;
  imgs: string[] | null;
  is_complete_profile: boolean | null;
  purposeValue: string | null;
  locate?: { type: string; coordinates: number[] };
  location: string | null;
  genderFind: string | null;
  ageRange: number[] | null;
};
