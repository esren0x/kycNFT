import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient"; // Adjusted path to Supabase client

export async function POST(request: Request) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    // Query Supabase for transactions related to the walletAddress
    const { data: transactions, error: dbError } = await supabase
      .from("mint_transactions")
      .select("status")
      .eq("wallet_address", walletAddress);

    if (dbError) {
      console.error("Supabase query error:", dbError);
      return NextResponse.json(
        { error: "Failed to query database", details: dbError.message },
        { status: 500 }
      );
    }

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        {
          message: "No minting transactions found for this wallet address.",
          hasError: false, // No transactions, so no confirmed error
        },
        { status: 200 } // Or 404, depending on desired behavior for no transactions
      );
    }

    const hasMintingStatus = transactions.some(
      (tx: { status: string }) => tx.status === "minting"
    );
    const hasFailedStatus = transactions.some(
      (tx: { status: string }) => tx.status === "failed"
    );
    const hasMintedStatus = transactions.some(
      (tx: { status: string }) => tx.status === "minted"
    );

    // If there's an ongoing "minting" process, we can't definitively say it failed yet.
    if (hasMintingStatus) {
      return NextResponse.json(
        {
          message: "Minting process is currently active or was re-initiated.",
          hasError: false, // Not a definitive error state yet
        },
        { status: 200 }
      );
    }

    // If there are no "minting" processes, and at least one "failed" process,
    // then we can consider it as failed, unless a "minted" one exists.
    if (hasFailedStatus) {
      if (hasMintedStatus) {
        // If there's a failed transaction but also a minted one,
        // it implies a retry might have succeeded.
        return NextResponse.json(
          {
            message:
              "Previous minting attempt(s) failed, but a successful mint was also found.",
            hasError: false, // A success exists, so not a current error state for the NFT
          },
          { status: 200 }
        );
      }
      // No "minting" and at least one "failed", and no "minted" means it's an error.
      return NextResponse.json(
        {
          message: "Minting process has failed for this wallet address.",
          hasError: true,
        },
        { status: 200 } // Using 200 to convey the result of the check
      );
    }

    // If none of the above (e.g., only "minted" or other statuses, but no "minting" and no "failed")
    return NextResponse.json(
      {
        message:
          "No active or failed minting process found. Process may have completed successfully or not started.",
        hasError: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/kyc/verify-error:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
