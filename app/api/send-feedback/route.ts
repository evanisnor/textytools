import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check for required Resend configuration
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const resend = new Resend(resendApiKey);
    const recipientEmail =
      process.env.FEEDBACK_RECIPIENT_EMAIL || "contact@textytools.dev";
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      "textytools.dev <contact@textytools.dev>";

    const { error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: `${name} <${email}>`,
      subject: `Feedback from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
    });

    if (resendError) {
      console.error("Resend API error:", resendError);
      throw new Error(resendError.message);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing feedback:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
