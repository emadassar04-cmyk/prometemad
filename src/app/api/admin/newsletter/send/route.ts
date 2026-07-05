import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdminApi, getSubscribers } from "@/lib/data/admin";

const MAX_SUBJECT_LENGTH = 200;

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return NextResponse.json(
      { error: "email_service_not_configured" },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const subject =
    typeof body?.subject === "string"
      ? body.subject.trim().slice(0, MAX_SUBJECT_LENGTH)
      : "";
  const html = typeof body?.html === "string" ? body.html.trim() : "";

  if (!subject || !html) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const subscribers = await getSubscribers();
  if (subscribers.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL;

  const results = await Promise.allSettled(
    subscribers.map((subscriber) =>
      resend.emails.send({
        from,
        to: subscriber.email,
        subject,
        html,
      }),
    ),
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.length - sent;

  return NextResponse.json({ sent, failed });
}
