import { NextResponse } from "next/server";
import {
  getOwnerIdFromMapping,
  getNFTExpirationBlock,
  checkIfHasNFT,
} from "../../../lib/mappings";

export async function GET(request: Request) {
  try {
    // Get the wallet address from the URL params
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const ownerId = await getOwnerIdFromMapping(wallet, false);
    if (!ownerId) {
      return NextResponse.json({
        verified: false,
        expirationBlock: null,
        ownerId: null,
      });
    }
    const expirationBlock = await getNFTExpirationBlock(ownerId, false);
    const hasNFT = await checkIfHasNFT(ownerId, false);

    const verificationData = {
      verified: hasNFT,
      expirationBlock: expirationBlock,
      ownerId: ownerId,
    };

    return NextResponse.json(verificationData);
  } catch (error) {
    console.error("Error verifying wallet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
