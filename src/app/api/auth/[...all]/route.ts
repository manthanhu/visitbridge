import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

export async function GET(req: Request) {
  console.log("BETTER AUTH GET CALLED WITH URL:", req.url);
  return handlers.GET(req);
}

export async function POST(req: Request) {
  return handlers.POST(req);
}
