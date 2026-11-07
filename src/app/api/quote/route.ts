import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";

export interface QuoteRequestBody {
  name: string;
  contact: string;
  service: string;
  description?: string;
  honeypot?: string; // Bot protection
}

export async function POST(request: Request) {
  try {
    const body: QuoteRequestBody = await request.json();

    // 1. Spam check via hidden honeypot
    if (body.honeypot && body.honeypot.trim() !== "") {
      return NextResponse.json(
        { error: "Automated submission rejected." },
        { status: 400 }
      );
    }

    // 2. Server-side validation
    const name = body.name?.trim();
    const contact = body.contact?.trim();
    const service = body.service?.trim();
    const description = body.description?.trim() || "";

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name." },
        { status: 422 }
      );
    }

    // Contact can be email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+0-9\s-]{8,20}$/;

    if (!contact || (!emailRegex.test(contact) && !phoneRegex.test(contact))) {
      return NextResponse.json(
        { error: "Please provide a valid business email or phone number." },
        { status: 422 }
      );
    }

    if (!service) {
      return NextResponse.json(
        { error: "Please select a required service." },
        { status: 422 }
      );
    }

    // Automatically record lead into Supabase enquiries table if connected
    if (supabase) {
      try {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        await supabase.from("enquiries").insert({
          name,
          email: isEmail ? contact : "client@digitalonix.in",
          phone: !isEmail ? contact : null,
          service,
          message: description || "Inquiry from website quote form",
          status: "new",
        });
      } catch (dbErr) {
        console.error("Failed to persist inquiry to database:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you! Your quote request has been received. Our strategy team in Bhopal will contact you within 24 hours.",
      data: {
        referenceId: `DO-${Date.now().toString().slice(-6)}`,
        name,
        service,
      },
    });
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

