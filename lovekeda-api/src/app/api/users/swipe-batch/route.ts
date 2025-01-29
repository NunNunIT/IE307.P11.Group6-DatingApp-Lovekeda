import { badRequestResponse, errorResponse, successfulResponse, unauthorizedResponse } from '@/utils/handlers';
import { NextRequest } from 'next/server';
import { User } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    const { user_id, swipes } = await req.json();
    if (!user_id) return unauthorizedResponse();
    if (!Array.isArray(swipes)) return badRequestResponse({ message: 'Invalid request' });

    const uniqueLikes = [...new Set(swipes.map((swipe) => swipe.target_user_id))];
    await User.updateMany(
      { user_id: { $in: uniqueLikes } },
      { $addToSet: { likes: user_id } }
    );

    const { likes } = await User.findOne({ user_id }, { likes: 1 }) as { likes: string[] };
    const mutualLikeIds = uniqueLikes.filter((id) => likes.includes(id));

    if (mutualLikeIds.length > 0) {
      const bulkOps = [
        {
          updateOne: {
            filter: { user_id },
            update: { $addToSet: { matches: { $each: mutualLikeIds } } },
          },
        },
        {
          updateMany: {
            filter: { user_id: { $in: mutualLikeIds } },
            update: { $addToSet: { matches: user_id } },
          },
        },
      ];

      await User.bulkWrite(bulkOps);
    }

    return successfulResponse({ message: 'Likes and matches updated successfully' });
  } catch (error) {
    console.error(error);
    return errorResponse({ message: 'Failed to process likes and matches' });
  }
}
