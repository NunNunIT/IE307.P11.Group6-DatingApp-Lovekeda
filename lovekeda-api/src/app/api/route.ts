import { successfulResponse } from "@/utils/handlers"

export const GET = () => {
  return successfulResponse({ data: "HELLO WORLD" });
}