import axios from "axios";
import { supabase } from "../../../lib/supabaseClient"; // Import Supabase client

const NODE_API_URL = process.env.NODE_API_URL || "http://localhost:3001";
const NETWORK = process.env.NETWORK || "testnet"; // Read network, default to testnet

export async function executeMintTransaction(
  walletAddress: string,
  kycLevel: number
): Promise<string> {
  let mintRecordId: string | null = null; // To store the ID of the Supabase record

  try {
    // Log initial status to Supabase
    console.log(
      "Logging initial minting status to Supabase for wallet:",
      walletAddress
    );
    const { data: initialData, error: initialError } = await supabase
      .from("mint_transactions")
      .insert([
        {
          wallet_address: walletAddress,
          kyc_level: kycLevel,
          network: NETWORK,
          status: "minting",
        },
      ])
      .select("id")
      .single(); // Use single() if you expect one row and want the object directly

    if (initialError) {
      console.error("Supabase initial insert error:", initialError);
      // Decide if you want to throw here or proceed without Supabase logging
      // For now, we'll log and proceed
    } else if (initialData) {
      mintRecordId = initialData.id;
      console.log("Supabase initial record created with ID:", mintRecordId);
    }

    console.log(
      "executing mint transaction",
      walletAddress,
      kycLevel,
      `${NODE_API_URL}/mint`
    );
    const response = await axios.post(`${NODE_API_URL}/mint`, {
      walletAddress,
      kycLevel,
    });

    if (response.data && response.data.success && response.data.transactionId) {
      // Update Supabase record to 'minted'
      if (mintRecordId) {
        const { error: updateError } = await supabase
          .from("mint_transactions")
          .update({
            status: "minted",
            transaction_id: response.data.transactionId,
          })
          .eq("id", mintRecordId);
        if (updateError) {
          console.error("Supabase success update error:", updateError);
        } else {
          console.log("Supabase record updated to minted:", mintRecordId);
        }
      }
      return response.data.transactionId;
    } else {
      const errorMessage =
        response.data?.error || "Unknown error from node-api";
      // Update Supabase record to 'failed'
      if (mintRecordId) {
        const { error: updateError } = await supabase
          .from("mint_transactions")
          .update({ status: "failed", error_message: errorMessage }) // Store error message
          .eq("id", mintRecordId);
        if (updateError) {
          console.error(
            "Supabase failed update error (on API non-success):",
            updateError
          );
        } else {
          console.log(
            "Supabase record updated to failed (on API non-success):",
            mintRecordId
          );
        }
      }
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    console.error(
      "Failed to call node-api /mint or interact with Supabase:",
      error
    );
    // Update Supabase record to 'failed' if an error occurred
    if (mintRecordId) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      const { error: updateError } = await supabase
        .from("mint_transactions")
        .update({ status: "failed", error_message: errorMessage })
        .eq("id", mintRecordId);
      if (updateError) {
        console.error("Supabase failed update error (on catch):", updateError);
      } else {
        console.log(
          "Supabase record updated to failed (on catch):",
          mintRecordId
        );
      }
    }
    throw error;
  }
}
