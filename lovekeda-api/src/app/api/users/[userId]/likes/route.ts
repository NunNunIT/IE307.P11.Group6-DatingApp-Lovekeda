import { errorResponse, successfulResponse, unauthorizedResponse } from '@/utils/handlers';
import { NextRequest } from 'next/server';
import { User } from '@/lib/models';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params;
    if (!userId) return unauthorizedResponse();

    const user = await User.findOne({ user_id: userId }, { likes: 1 });
    if (!user) return errorResponse({ message: 'User not found' });

    const likedUsers = await User.find(
      { user_id: { $in: user.likes } }
    ).lean();

    return successfulResponse({ message: 'Liked users retrieved successfully', data: likedUsers });
  } catch (error) {
    console.error(error);
    return errorResponse({ message: 'Failed to fetch liked users' });
  }
}
