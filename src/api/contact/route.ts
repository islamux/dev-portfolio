import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactFormData } from "@/types/content";

const resendApiKey = process.env.RESEND_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (data.message.length < 10) {
      return NextResponse.json(
        { error: "Message too short (minimum 10 characters)" },
        { status: 400 }
      );
    }

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const contactEmail = process.env.CONTACT_EMAIL || "fathi733@gmail.com";

      await resend.emails.send({
        from: `Portfolio Contact <onboarding@resend.dev>`,
        to: [contactEmail],
        replyTo: data.email,
        subject: `Portfolio Contact from ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
        `,
      });
    } else {
      console.log("Contact form submission (no RESEND_API_KEY):", {
        name: data.name,
        email: data.email,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try emailing directly." },
      { status: 500 }
    );
  }
}

