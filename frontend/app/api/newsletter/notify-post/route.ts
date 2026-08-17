import { NextRequest, NextResponse } from "next/server";
import { getSubscribersForSite } from "@/lib/subscriberStore";

interface NotifyPostBody {
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  siteSlug?: string;
  siteName?: string;
  siteId?: string | number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as NotifyPostBody;
    const title = body.title || "New Story Published";
    const slug = body.slug || "";
    const excerpt = body.excerpt || "Check out our newest post on our website!";
    const siteName = body.siteName || "Blog";
    const siteSlug = body.siteSlug || "";

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const postUrl = siteSlug
      ? `${baseUrl}/s/${siteSlug}/blog/${slug}`
      : `${baseUrl}/blog/${slug}`;

    const host = process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.EMAIL_PORT || "587", 10);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.log(`[Post Broadcast Alert] 📧 New post notification for "${siteName}": "${title}"`);
      console.log(`[Post Broadcast Alert] → URL: ${postUrl}`);
      console.log(`[Post Broadcast Alert] ⚠️ Simulation Mode active (configure EMAIL_USER/EMAIL_PASS in .env.local to send live emails)`);

      return NextResponse.json({
        success: true,
        simulated: true,
        message: `Post alert simulated for "${title}" on ${siteName}`,
        postUrl,
      });
    }

    let nodemailer: any;
    try {
      // @ts-ignore
      nodemailer = await import("nodemailer");
    } catch {
      return NextResponse.json({
        success: true,
        simulated: true,
        message: "Nodemailer package not installed. Broadcast simulated.",
        postUrl,
      });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      connectionTimeout: 8000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      auth: { user, pass },
    });

    const fromName = process.env.EMAIL_FROM_NAME || siteName;
    const fromEmail = process.env.EMAIL_FROM || user;
    const subject = `NEW POST: ${title} — ${siteName}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px 20px; margin: 0; }
            .container { max-width: 580px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: #2563eb; color: white; padding: 32px 40px; text-align: center; }
            .content { padding: 36px 40px; }
            h1 { margin: 0 0 16px; font-size: 22px; color: #0f172a; line-height: 1.3; }
            p { line-height: 1.6; color: #475569; font-size: 15px; margin-bottom: 20px; }
            .btn { display: inline-block; background: #2563eb; color: white !important; font-weight: 700; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-size: 14px; margin-top: 8px; }
            .footer { padding: 20px 40px; background: #f1f5f9; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="color:white; margin:0; font-size: 20px;">${siteName}</h2>
              <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 13px;">New Article Alert</p>
            </div>
            <div class="content">
              <h1>${title}</h1>
              <p>${excerpt}</p>
              <div style="text-align: center; margin-top: 24px;">
                <a href="${postUrl}" class="btn">Read Full Story →</a>
              </div>
            </div>
            <div class="footer">
              You are receiving this because you subscribed to email alerts on ${siteName}.<br>
              <a href="${postUrl}" style="color: #64748b; text-decoration: underline;">View in Browser</a>
            </div>
          </div>
        </body>
      </html>
    `;

    const subscribers = getSubscribersForSite(siteSlug);
    const recipients = subscribers.length > 0 ? subscribers : [user];

    console.log(`[Post Broadcast] Sending alerts to ${recipients.length} subscriber(s):`, recipients);

    // Send broadcast email to all site subscribers in parallel
    const emailPromises = recipients.map((recipient) =>
      transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: recipient,
        subject,
        html,
        text: `New post on ${siteName}: ${title}\n\nRead here: ${postUrl}`,
      }).catch((e: any) => {
        console.error(`[Post Broadcast] Failed sending to ${recipient}:`, e?.message || e);
      })
    );

    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      success: true,
      count: recipients.length,
      recipients,
      message: `Post publication alert dispatched to ${recipients.length} subscriber(s) for "${title}"`,
      postUrl,
    });
  } catch (error: any) {
    console.error("[Post Broadcast Alert Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch post notification", details: error.message },
      { status: 500 }
    );
  }
}
