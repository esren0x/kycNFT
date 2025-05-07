import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import crypto from "crypto";

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

export async function POST(request: Request) {
  try {
    if (!process.env.SUMSUB_APP_TOKEN || !process.env.SUMSUB_APP_SECRET) {
      console.error("Missing Sumsub credentials:", {
        hasAppToken: !!process.env.SUMSUB_APP_TOKEN,
        hasAppSecret: !!process.env.SUMSUB_APP_SECRET,
      });
      return NextResponse.json(
        { success: false, error: "Sumsub credentials not configured" },
        { status: 500 }
      );
    }

    const { walletAddress } = await request.json();
    const formattedWalletAddress = formatWalletAddress(walletAddress);
    console.log("Initializing KYC for wallet:", formattedWalletAddress);

    // Verify the signature (you should implement proper signature verification)
    const isValidSignature = true; // Replace with actual verification

    if (!isValidSignature) {
      console.error("Invalid signature for wallet:", formattedWalletAddress);
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    console.log("Generating access token for wallet:", formattedWalletAddress);

    try {
      const endpoint = "/resources/accessTokens/sdk";
      const method = "POST";
      const requestBody = JSON.stringify({
        userId: formattedWalletAddress,
        ttlInSecs: 600, // Token valid for 10 minutes
        levelName: "id-only", // Add the level name for KYC verification
      });
      const ts = Math.floor(Date.now() / 1000);
      const signature = generateSignature(
        ts,
        process.env.SUMSUB_APP_SECRET,
        method,
        endpoint,
        requestBody
      );

      // Generate access token for WebSDK
      const tokenResponse = await axios.post(
        `${SUMSUB_API_URL}${endpoint}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-App-Token": process.env.SUMSUB_APP_TOKEN,
            "X-App-Access-Sig": signature,
            "X-App-Access-Ts": ts.toString(),
          },
        }
      );

      console.log(
        "Successfully generated token for wallet:",
        formattedWalletAddress
      );

      return NextResponse.json({
        success: true,
        token: tokenResponse.data.token,
      });
    } catch (tokenError: unknown) {
      const error = tokenError as AxiosError;
      console.error("Token generation failed:", {
        walletAddress: formattedWalletAddress,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate access token",
          details: error.response?.data || error.message,
        },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error("KYC initialization failed:", {
      error: axiosError.message,
      stack: axiosError.stack,
      response: axiosError.response?.data,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize KYC process",
        details: axiosError.response?.data || axiosError.message,
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}
