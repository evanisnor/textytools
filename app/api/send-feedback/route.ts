import { NextRequest, NextResponse } from "next/server";
import formData from "form-data";
import Mailgun from "mailgun.js";

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

    // Check for required Mailgun configuration
    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;

    if (!mailgunApiKey || !mailgunDomain) {
      console.error("MAILGUN_API_KEY or MAILGUN_DOMAIN is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    // Initialize Mailgun client
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: mailgunApiKey,
    });

    // Get the authorized recipient email for sandbox/free accounts
    const recipientEmail =
      process.env.MAILGUN_RECIPIENT_EMAIL || "contact@textytools.dev";

    // Send email via Mailgun
    try {
      await mg.messages.create(mailgunDomain, {
        from: `textytools.dev <noreply@${mailgunDomain}>`,
        to: [recipientEmail],
        "h:Reply-To": `${name} <${email}>`,
        subject: `Feedback from ${name}`,
        text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
      });
    } catch (mailgunError) {
      console.error("Mailgun API error:", {
        error: mailgunError,
        message:
          mailgunError instanceof Error
            ? mailgunError.message
            : "Unknown error",
      });
      throw mailgunError;
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
