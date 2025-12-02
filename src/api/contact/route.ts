/**
 * POST /api/contact
 * Handles contact form submissions
 */
import { NextRequest, NextResponse } from "next/server";
import { ContactFormData } from "@/types/content";


interface ContactSuccessResponse {
  success: boolean;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validation
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Message length validation
    if (data.message.length < 10) {
      return NextResponse.json(
        { error: "Message too short (minimum 10 characters)" },
        { status: 400 }
      );
    }

    // TODO: Send email using a service like SendGrid, Resend, or Nodemailer
    // For now, just log it
    console.log("Contact form submission:", {
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // Simple mailto fallback (opens user's email client)
    // You can replace this with actual email sending service
    return NextResponse.json<ContactSuccessResponse>(
      {
        success: true,
        message: "Message received successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

