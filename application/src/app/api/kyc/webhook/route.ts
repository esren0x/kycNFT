import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get("x-sumsub-signature");

    // Verify webhook signature
    const isValid = verifySumsubSignature(
      JSON.stringify(payload),
      signature || "",
      process.env.SUMSUB_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const { type, payload: webhookPayload } = payload;
    console.log("webhookPayload", webhookPayload);

    // Handle different webhook events
    switch (type) {
      case "applicantReviewed":
        // Update your database with the verification status
        // You might want to trigger additional actions here
        break;

      case "applicantCreated":
        // Handle new applicant creation
        break;

      default:
        console.log("Unhandled webhook event:", type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to process webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}

function verifySumsubSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const calculatedSignature = hmac.update(payload).digest("hex");
  return calculatedSignature === signature;
}
