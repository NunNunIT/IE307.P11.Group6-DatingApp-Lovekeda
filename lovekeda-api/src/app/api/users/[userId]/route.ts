import { User } from "@/lib/models";
import { badRequestResponse, errorResponse, successfulResponse } from "@/utils/handlers";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;
  if (!userId) return badRequestResponse({ message: "userId is required" });
  try {
    const user = await User.findOne({ user_id: userId });
    if (!user) return badRequestResponse({ message: "user not found" });

    return successfulResponse({ data: user });
  } catch (error: any) {
    console.log("🚀 ~ @GET /users/:userId ~ error:", error.message);
    return errorResponse({ message: error?.message });
  }
}

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  const { userId } = await params;
  if (!userId) return badRequestResponse({ message: "userId is required" });
  try {
    const updatedData = await req.json();
    if (updatedData.user_id) return badRequestResponse({ message: "user_id cannot be updated" });
    if (updatedData.email) return badRequestResponse({ message: "email cannot be updated" });
    const user = await User.findOneAndUpdate({ user_id: userId }, updatedData, { new: true });
    if (!user) return badRequestResponse({ message: "user not found" });

    return successfulResponse({ data: user });
  } catch (error: any) {
    console.log("🚀 ~ @GET /users/:userId ~ error:", error.message);
    return errorResponse({ message: error?.message });
  }
}
