import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const teamId = req.headers.get("x-team-id");

    if (!teamId) {
      return NextResponse.json(
        { error: "Missing team id" },
        { status: 400 }
      );
    }

    const base_url = `${process.env.SERVER_URL}/team/fetch-all`;

    const res = await fetch(base_url, {
      headers: {
        "Content-Type": "application/json",
        "x-team-id": teamId, // 👈 forward to backend
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
