import { User } from '@/lib/models';
import { calculateDistance } from '@/utils/functions';
import { errorResponse, successfulResponse } from '@/utils/handlers';
import { NextRequest } from 'next/server';

// TODO: Replace this with your own data
const USER_DATA = [
  {
    id: "1",
    name: "Nguyễn Văn Hiếu",
    imgs: [
      "https://www.baoduyenbabyhouse.com/wp-content/uploads/2022/02/20170416_171990fc8d382ebd682b7127a5ef0bb7_1492336881.jpg",
    ],
    gender: "male",
    distance: "5m",
    age: "18",
    bio: "Hiếu ngu dốt tìm gái",
    city: "HCM",
    country: "VN",
    hobbies: ["nấu ăn", "âm nhạc"]
  },
  {
    id: "2",
    name: "Trần Văn Bình",
    imgs: [
      "https://thanhnien.mediacdn.vn/uploaded/longbn/2020_06_08/lo2_NOGF.jpg?width=500",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqbCB5BRIt-wX2fd4aMMw2Z2XJ9x2bjbDnfg&s",
    ],
    age: "18",
    gender: "male",
    distance: "5m",
    bio: "Hello",
    city: "HCM",
    country: "VN",
    hobbies: ["nấu ăn", "âm nhạc", "diễn kịch", "ngủ"]
  },
  {
    id: "4",
    name: "Phạm Minh Tuấn",
    imgs: [
      "https://tdmuflc.edu.vn/wp-content/uploads/2023/09/46-hinh-anh-trai-dep-che-mat-2.jpg",
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fsaostyle.vn%2Fdan-trai-dep-the-he-moi-vua-hoc-gioi-vua-da-tai%2F&psig=AOvVaw2CTxX-rU0VVeV7grlzC5I3&ust=1734764116034000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPiQjYjjtYoDFQAAAAAdAAAAABAU",
    ],
    age: "22",
    distance: "1m",
    gender: "male",
    bio: "Tuấn tiền tỉ",

    city: "HCM",
    country: "VN",
    hobbies: ["giàu"]

  },
  {
    id: "6",
    name: "Trần Anh Hào",
    imgs: [
      "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-trai-dep-Viet-Nam-81.jpg",
    ],
    age: "30",
    gender: "male",
    bio: "Tìm gái fwb",

    city: "HCM",
    distance: "1m",
    country: "VN",
    hobbies: ["ăn uống", "nhậu"]
  },
  {
    id: "7",
    name: "Lê Bảo Sương",
    imgs: [
      "https://photo.znews.vn/w660/Uploaded/ofh_fdmzsofw/2016_10_28/14670777_108710116266800_7518345884795538863_n_1.jpg",
    ],
    age: "20",
    gender: "female",
    bio: "Thích trai đẹp",

    city: "HCM",
    distance: "1m",
    country: "VN",
    hobbies: ["yêu đương", "fwb"]
  },
  {
    id: "3",
    name: "Lê Thị Hương",
    imgs: [
      "https://anhnail.com/wp-content/uploads/2024/10/Hinh-gai-xunh-Han-Quoc-toc-dai.jpg",
      "https://icdn.24h.com.vn/upload/3-2023/images/2023-09-07/1-1694075003-137-width740height888.jpg",
      "https://cdn.aicschool.edu.vn/wp-content/uploads/2024/05/anh-co-gai-xinh-1.jpg",
    ],
    age: "22",
    gender: "female",
    bio: "Hương xinh gái cute đáng yêu",

    distance: "3m",
    city: "HCM",
    country: "VN",
    hobbies: ["game"]

  },
  {
    id: "8",
    name: "Ngọc Trinh",
    imgs: [
      "https://giadinh.mediacdn.vn/296230595582509056/2021/5/9/photo-7-16205612188382001922015.jpeg",
    ],
    age: "20",
    gender: "female",

    city: "HCM",
    bio: "Bio cuar ai do",
    distance: "1m",
    country: "VN",
    hobbies: ["yêu đương", "điện thoại", "mua sắm"]
  },
  {
    id: "5",
    name: "Phạm Minh Hòa",
    imgs: [
      "https://ispacedanang.edu.vn/wp-content/uploads/2024/05/hinh-anh-dep-ve-hoc-sinh-cap-3-1.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkhSY0ashlgEOOv6UQf7QVJLNeJWuB_cb9cw&s",
      "https://bikipdepxinh.com/wp-content/uploads/anh-gai-xinh-3.jpg",
      "https://ispacedanang.edu.vn/wp-content/uploads/2024/05/hinh-anh-dep-ve-hoc-sinh-cap-3-2.jpg",
    ],
    age: "18",
    bio: "Phạm Minh Hòa đẹp trai ",
    gender: "male",
    city: "HCM",
    distance: "1m",
    country: "VN",
    hobbies: ["sở thích 1"]

  },
  {
    id: "9",
    name: "Thanh Trung",
    imgs: [
      "https://i.pinimg.com/236x/82/c2/b4/82c2b4e5e39f1a0fb474f5574d890e89.jpg",

      "https://kenh14cdn.com/thumb_w/660/2017/20664687-1931280623811540-2633903832468491112-n-1505389713725-1513421614447.jpg",
    ],
    age: "20",
    gender: "male",
    bio: "Hello 2",
    city: "HCM",
    distance: "1m",
    country: "VN",
    hobbies: ["coding", "ngủ", "lười"]

  },
  {
    id: "10",
    name: "Chiquaqua",
    imgs: [
      "https://media.istockphoto.com/id/582257588/vi/anh/ch%C3%A2n-dung-ch%C3%A0ng-trai-b%C3%A9o-ph%C3%AC-%C4%91%E1%BA%B9p-trai.jpg?s=1024x1024&w=is&k=20&c=boKchv-pldNu4cD6SqNAn1k0IMuBMN60uzV3EhsjsPY=",
    ],
    age: "20",
    gender: "male",
    bio: "Hello",
    city: "HCM",
    distance: "1m",
    country: "VN",
    hobbies: ["chó mèo", "chúa hề"]

  },
  {
    id: "11",
    name: "Gia Baor",
    imgs: [
      "https://cafefcdn.com/203337114487263232/2022/6/3/photo-1-16542387788121418948737.jpeg",
      "https://cafebiz.cafebizcdn.vn/162123310254002176/2022/2/5/photo-1-1644042833020745879342.jpg",
    ],
    age: "22",
    gender: "male",
    bio: "Hello",
    city: "HCM",
    distance: "1m",
    country: "VN",
    hobbies: ["deadline", "chúa hề"]
  },
] as const;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get('search') ?? '';
  const limit = Number(searchParams.get('limit')) || 10;
  const page = Number(searchParams.get('page')) || 1;
  const gender = searchParams.get('gender') ?? 'all';
  const age = searchParams.get('age') ?? 'all';
  const distance = Number(searchParams.get('distance')) || 50;
  const lat = Number(searchParams.get('lat'));
  const long = Number(searchParams.get('long'));

  const filter = {} as any;
  if (search) filter.name = { $regex: new RegExp(search, 'i') };
  if (gender && gender !== "all") filter.gender = gender;
  if (age && age !== "all") {
    const [min, max] = age.split('-').map(Number);
    filter.age = { $gte: min, $lte: max };
  }
  if (lat && long && !isNaN(lat) && !isNaN(long)) {
    filter.locate = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [Number(long), Number(lat)],
        },
        $maxDistance: distance * 1000,
      },
    };
  }

  try {
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    if (lat && long && !isNaN(lat) && !isNaN(long)) {
      return successfulResponse({
        data: users.map(user => {
          const userCoordinates = user.locate.coordinates;
          const distance = calculateDistance(Number(lat), Number(long), userCoordinates[1], userCoordinates[0]);
          return { ...user.toJSON(), distance };
        })
      });
    }

    return successfulResponse({ data: users });
  } catch (error: any) {
    console.error("🚀 ~ GET ~ error:", error.message)
    return errorResponse({ message: error?.message ?? "Unknown error" });
  }
}