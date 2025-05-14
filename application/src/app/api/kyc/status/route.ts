import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
import { executeMintTransaction } from "../utils/transaction";
import { checkIfHasNFT } from "../../../../lib/mappings";
import { getOwnerIdFromMapping } from "../../../../lib/mappings";

const SUMSUB_API_URL = "https://api.sumsub.com";

function generateSignature(
  ts: number,
  secret: string,
  method: string,
  endpoint: string,
  body: string
): string {
  const signString = `${ts}${method}${endpoint}${body}`;
  return crypto.createHmac("sha256", secret).update(signString).digest("hex");
}

function formatWalletAddress(walletAddress: string): string {
  // Remove any special characters and convert to lowercase
  return walletAddress.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function getApplicantId(walletAddress: string): Promise<string> {
  console.log("getting applicant id for:", walletAddress);
  const endpoint = `/resources/applicants/-;externalUserId=${walletAddress}/one`;
  const method = "GET";
  const ts = Math.floor(Date.now() / 1000);
  const signature = generateSignature(
    ts,
    process.env.SUMSUB_APP_SECRET!,
    method,
    endpoint,
    ""
  );

  const response = await axios.get(`${SUMSUB_API_URL}${endpoint}`, {
    headers: {
      Accept: "application/json",
      "X-App-Token": process.env.SUMSUB_APP_TOKEN,
      "X-App-Access-Sig": signature,
      "X-App-Access-Ts": ts.toString(),
    },
  });

  if (!response.data?.id) {
    throw new Error("Applicant not found");
  }

  return response.data.id;
}

export async function GET(request: Request) {
  console.log("getting kyc status");
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    if (!process.env.SUMSUB_APP_TOKEN || !process.env.SUMSUB_APP_SECRET) {
      console.error("Missing Sumsub credentials:", {
        hasAppToken: !!process.env.SUMSUB_APP_TOKEN,
        hasAppSecret: !!process.env.SUMSUB_APP_SECRET,
      });
      return NextResponse.json(
        { error: "Sumsub credentials not configured" },
        { status: 500 }
      );
    }

    const formattedWalletAddress = formatWalletAddress(walletAddress);

    // First get the applicant ID
    const applicantId = await getApplicantId(formattedWalletAddress);

    // Then use the applicant ID to get the status
    const endpoint = `/resources/applicants/${applicantId}/status`;
    const method = "GET";
    const ts = Math.floor(Date.now() / 1000);
    const signature = generateSignature(
      ts,
      process.env.SUMSUB_APP_SECRET,
      method,
      endpoint,
      ""
    );

    // Get applicant status from Sumsub
    const response = await axios.get(`${SUMSUB_API_URL}${endpoint}`, {
      headers: {
        Accept: "application/json",
        "X-App-Token": process.env.SUMSUB_APP_TOKEN,
        "X-App-Access-Sig": signature,
        "X-App-Access-Ts": ts.toString(),
      },
    });

    // Map Sumsub status to our status
    let status: "not_started" | "in_progress" | "completed" | "failed";

    if (response.data.reviewStatus === "completed") {
      status =
        response.data.reviewResult?.reviewAnswer === "GREEN"
          ? "completed"
          : "failed";

      if (status === "completed") {
        try {
          console.log("checking if has NFT");
          const ownerId = await getOwnerIdFromMapping(walletAddress, false);
          console.log("ownerId", ownerId);

          const hasNFT = ownerId
            ? !!(await checkIfHasNFT(ownerId, false))
            : false;
          console.log("hasNFT", hasNFT);
          if (!hasNFT) {
            console.log("minting the nft");

            // Execute the mint transaction with KYC level 1
            const tx_id = await executeMintTransaction(
              formattedWalletAddress,
              1 // KYC level 1 for basic verification
            );

            console.log("NFT mint transaction submitted:", tx_id);
          } else {
            console.log("NFT already minted");
          }

          // Return both status and transaction ID
          return NextResponse.json({
            status,
            message: "NFT mint transaction submitted successfully",
          });
        } catch (mintError) {
          console.error("Failed to mint NFT:", mintError);
          throw mintError;
        }
      }
    } else if (response.data.reviewStatus === "pending") {
      status = "in_progress";
    } else {
      status = "not_started";
    }

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Failed to check KYC status:", error);

    // Log detailed error information
    if (axios.isAxiosError(error)) {
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to check KYC status" },
      { status: 500 }
    );
  }
}
