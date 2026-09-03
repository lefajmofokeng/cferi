import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION = `You are the virtual assistant for the Maluti TVET College Incubation Center, a business incubation program in South Africa.

Help visitors with questions about:
- Business Incubation Programme: our core 12-month incubation support for early-stage entrepreneurs.
- Entrepreneurship Training: practical training for new founders.
- Mentorship Programme: 1-on-1 guidance from industry mentors.
- Enterprise & Skills Development: skill-building support for growing teams.
- How to apply: applicants fill out the incubation application form at /apply, and receive a reference number to track their application status at /track-application.
- News, Events, Job Opportunities, Announcements, Learn articles, Case Studies, and Research Papers are all available on the site to explore.
- For anything you cannot answer confidently, direct the visitor to the Contact page at /contact, or the Help Center at /help-center.

Keep answers concise, warm, and professional. Do not make up specific dates, prices, or facts you don't actually know — direct the visitor to Contact for anything uncertain.`;

export async function POST(request: Request) {
  const { messages } = await request.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const contents = messages.map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error:", errorText);
    return NextResponse.json(
      { error: "The assistant is temporarily unavailable." },
      { status: 502 }
    );
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I didn't catch that.";

  return NextResponse.json({ reply });
}