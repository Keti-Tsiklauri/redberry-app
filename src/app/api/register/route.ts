// src/app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const res = await fetch(
    "https://api.redseam.redberryinternship.ge/api/register",
    {
      method: "POST",
      body,
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
