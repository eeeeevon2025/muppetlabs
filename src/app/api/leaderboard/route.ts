import { NextResponse } from "next/server";
import { getMuppetMatchCounts, getQuizResultCount } from "@/lib/stats";

export async function GET() {
  return NextResponse.json({
    totalResults: getQuizResultCount(),
    matches: getMuppetMatchCounts(),
  });
}
