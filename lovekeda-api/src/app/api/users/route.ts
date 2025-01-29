import { User } from "@/lib/models";
import { badRequestResponse, createdResponse, errorResponse } from "@/utils/handlers";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { user_id, email } = await req.json();
    if (!user_id || !email)
      return badRequestResponse({ message: "user_id and email are required" });

    const user = await User.create({ user_id, email });
    return createdResponse({ data: user });
  } catch (error: any) {
    console.log("🚀 ~ @POST /users ~ error:", error.message);
    return errorResponse({ message: error?.message });
  }
}