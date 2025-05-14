import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.explorer.provable.com/v1/mainnet/latest/height"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching block height:", error);
    return NextResponse.json(
      { error: "Failed to fetch block height" },
      { status: 500 }
    );
  }
}
