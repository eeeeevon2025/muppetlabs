import { NextResponse } from "next/server";
import { MUPPETS } from "@/lib/muppets";

export async function GET() {
  return NextResponse.json({ muppets: MUPPETS });
}
