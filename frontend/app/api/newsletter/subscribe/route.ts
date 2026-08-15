import { NextRequest, NextResponse } from 'next/server';

interface SubscribeBody {
  email?: string;
  siteSlug?: string;
  siteId?: string | number;
  siteName?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendSubscriptionEmail(to: string, siteName: string, siteSlug?: string) {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('[Newsletter] ⚠️  EMAIL_USER and EMAIL_PASS not configured in .env.local');
    console.log('[Newsletter] → Create .env.local using .env.local.example');
    console.log('[Newsletter] → For Gmail: use App Password (not regular password)');
    console.log(`[Newsletter] Would send to: ${to} | Site: ${siteName}`);
    return { success: true, simulated: true };
  }

  let nodemailer: any;
  try {
    nodemailer = await import('nodemailer');
  } catch {
    console.warn('[Newsletter] nodemailer package not installed. Simulating subscription.');
    return { success: true, simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: {
      user,
      pass,
    },
  });

  const fromName = process.env.EMAIL_FROM_NAME || siteName || 'Verdura';
  const fromEmail = process.env.EMAIL_FROM || user;

  const siteUrl = siteSlug 
    ? `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/s/${siteSlug}`
    : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');

  const subject = `Welcome to ${siteName} — Thanks for subscribing!`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #f8f7f4; color: #1f2937; padding: 40px 20px; }
          .container { max-width: 520px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .header { background: #14532d; color: white; padding: 32px 40px; text-align: center; }
          .content { padding: 40px; }
          h1 { margin: 0 0 12px; font-size: 24px; }
          p { line-height: 1.6; margin-bottom: 16px; }
          .footer { padding: 20px 40px; background: #f8f7f4; font-size: 13px; color: #64748b; }
          a { color: #14532d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color:white; margin:0;">${siteName}</h1>
          </div>
          <div class="content">
            <h1>Thank you for subscribing!</h1>
            <p>Hi there,</p>
            <p>You've successfully subscribed to <strong>${siteName}</strong>. We'll send you our latest stories, updates, and nature-inspired reads straight to your inbox.</p>
            <p>We promise not to spam you — just the good stuff.</p>
            <p style="margin-top: 24px;">
              <a href="${siteUrl}" style="font-weight:600;">Visit ${siteName} →</a>
            </p>
          </div>
          <div class="footer">
            You're receiving this because you subscribed at ${siteName}.<br>
            ${siteSlug ? `Site: /s/${siteSlug}` : ''}
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      html,
      text: `Thank you for subscribing to ${siteName}!\n\nVisit us: ${siteUrl}`,
    });

    console.log(`[Newsletter] Email sent successfully to ${to} for ${siteName}`);
    return { success: true };
  } catch (error: any) {
    console.error('[Newsletter] Email send failed:', error.message);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubscribeBody;
    const email = (body.email || '').trim().toLowerCase();
    const siteName = body.siteName || 'Verdura';
    const siteSlug = body.siteSlug;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Send the email
    const result = await sendSubscriptionEmail(email, siteName, siteSlug);

    return NextResponse.json({
      success: true,
      message: result.simulated 
        ? 'Subscribed (email simulated - set EMAIL_USER/EMAIL_PASS to send real emails)' 
        : 'Subscription successful. Welcome email sent.',
      simulated: !!result.simulated,
    });
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process subscription',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
