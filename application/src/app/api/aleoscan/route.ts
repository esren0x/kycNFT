import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  const programId = searchParams.get("programId");
  const mapping = searchParams.get("mapping");

  if (!path || !programId || !mapping) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.testnet.aleoscan.io/v2/mapping/list_program_mapping_values/${programId}/${mapping}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Validate the response structure
    if (!data || !Array.isArray(data.result)) {
      return NextResponse.json({ result: [] });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching from Aleoscan:", error);
    return NextResponse.json({ result: [] });
  }
}
