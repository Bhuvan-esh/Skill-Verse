import { db } from '@/lib/db';
import nodemailer from 'nodemailer';

export interface EmailSendOptions {
  type:
    | 'ACCOUNT_APPROVAL'
    | 'LOGIN_SECURITY'
    | 'ADMIN_ALERT'
    | 'EVENT_ANNOUNCEMENT'
    | 'REGISTRATION_CONFIRMATION'
    | 'REMINDER_3DAYS'
    | 'REMINDER_1DAY'
    | 'CREDIT_UPDATED'
    | 'LEADERBOARD_UPDATED'
    | 'ADMIN_ANNOUNCEMENT'
    | 'VOLUNTEER_ACCESS_STARTED';
  recipientEmail: string;
  recipientName?: string;
  recipientUid?: string;
  subject: string;
  htmlContent: string;
  eventId?: string;
  registrationId?: string;
  idempotencyKey?: string;
}

/**
 * Base HackCulture-style responsive HTML wrapper
 */
export function buildHackCultureEmail({
  title,
  preheader,
  greetingName,
  badgeText,
  badgeColor = '#a78bfa',
  mainContentHtml,
  ctaText,
  ctaUrl,
  footerNote,
}: {
  title: string;
  preheader?: string;
  greetingName?: string;
  badgeText?: string;
  badgeColor?: string;
  mainContentHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  footerNote?: string;
}): string {
  const currentYear = new Date().getFullYear();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_BASE_URL || 'http://localhost:3000';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #08070d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased; }
    table { border-collapse: separate; }
    a { color: #a78bfa; text-decoration: none; }
    .card { background-color: #12101e; border: 1px solid rgba(167, 139, 250, 0.25); border-radius: 16px; padding: 28px; }
    .btn { background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #d97706 100%); color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block; text-align: center; text-decoration: none; letter-spacing: 0.5px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: monospace; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #08070d;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>` : ''}
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
    <!-- Brand Header -->
    <tr>
      <td style="padding: 16px 0 24px 0; text-align: center;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <div style="display: inline-block; padding: 8px 16px; border-radius: 12px; background: rgba(167, 139, 250, 0.1); border: 1px solid rgba(167, 139, 250, 0.3);">
                <span style="font-size: 16px; font-weight: 800; letter-spacing: 1.5px; color: #ffffff;">⚡ STUDENT CLUB</span>
                <span style="color: #a78bfa; font-size: 13px; font-family: monospace; margin-left: 6px;">/ IDEA HUB</span>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Card Body -->
    <tr>
      <td>
        <div class="card" style="background-color: #12101e; border: 1px solid rgba(167, 139, 250, 0.25); border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          ${badgeText ? `
          <div style="margin-bottom: 16px;">
            <span class="badge" style="background: rgba(167, 139, 250, 0.15); color: ${badgeColor}; border: 1px solid ${badgeColor}50;">
              ${badgeText}
            </span>
          </div>
          ` : ''}

          <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.3;">
            ${title}
          </h1>

          ${greetingName ? `
          <p style="color: #e2e8f0; font-size: 15px; margin: 0 0 16px 0; line-height: 1.5;">
            Hello <strong>${greetingName}</strong>,
          </p>
          ` : ''}

          <div style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            ${mainContentHtml}
          </div>

          ${ctaText && ctaUrl ? `
          <div style="text-align: center; margin: 30px 0 16px 0;">
            <a href="${ctaUrl}" class="btn" style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #d97706 100%); color: #ffffff !important; font-weight: 700; font-size: 13px; padding: 14px 28px; border-radius: 10px; display: inline-block; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
              ${ctaText} →
            </a>
          </div>
          ` : ''}

          ${footerNote ? `
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08); color: #94a3b8; font-size: 12px; line-height: 1.5;">
            ${footerNote}
          </div>
          ` : ''}
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 24px 12px; text-align: center; color: #64748b; font-size: 11px; line-height: 1.6;">
        <p style="margin: 0 0 8px 0; font-family: monospace;">
          Student Club Platform • 4 Domains: 💡 Idea Hub • 💻 Coding • 🗣️ Soft Skills • 🤝 Skill Barter
        </p>
        <p style="margin: 0 0 12px 0;">
          You received this email because you are a registered student or ambassador at Student Club.
        </p>
        <p style="margin: 0;">
          <a href="${appUrl}" style="color: #a78bfa; text-decoration: underline; margin: 0 8px;">Portal Home</a> |
          <a href="${appUrl}/dashboard" style="color: #a78bfa; text-decoration: underline; margin: 0 8px;">My Dashboard</a> |
          <a href="${appUrl}/soft-skills" style="color: #a78bfa; text-decoration: underline; margin: 0 8px;">Skill League</a>
        </p>
        <p style="margin: 12px 0 0 0; color: #475569;">
          © ${currentYear} Student Club Ecosystem. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Main Email Dispatch Engine with Idempotency & Free-Tier support
 */
export async function sendClubEmail(options: EmailSendOptions): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const {
    type,
    recipientEmail,
    recipientName,
    recipientUid,
    subject,
    htmlContent,
    eventId,
    registrationId,
    idempotencyKey,
  } = options;

  try {
    // 1. Idempotency Check: Prevent duplicate email sends
    if (idempotencyKey) {
      const existingLog = await db.emailLog.findUnique({
        where: { idempotency_key: idempotencyKey },
      });
      if (existingLog && existingLog.status === 'SENT') {
        console.log(`[Email Engine] Skipping duplicate email with idempotency key: ${idempotencyKey}`);
        return { success: true, messageId: existingLog.provider_message_id || 'cached-idempotent' };
      }
    }

    let providerMessageId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let sendSuccess = true;
    let sendError: string | undefined;

    // 2. Dispatch via configured free provider (Brevo / Resend / Console Fallback)
    const resendApiKey = process.env.RESEND_API_KEY;
    const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;

    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'Student Club <onboarding@resend.dev>',
            to: [recipientEmail],
            subject,
            html: htmlContent,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          providerMessageId = data.id || providerMessageId;
        } else {
          sendSuccess = false;
          sendError = JSON.stringify(data);
        }
      } catch (err: any) {
        sendSuccess = false;
        sendError = err.message;
      }
    } else if (brevoApiKey) {
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
          body: JSON.stringify({
            sender: {
              name: process.env.EMAIL_FROM_NAME || 'Student Club',
              email: process.env.EMAIL_FROM || 'noreply@studentclub.edu',
            },
            to: [{ email: recipientEmail, name: recipientName || recipientEmail }],
            subject,
            htmlContent,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          providerMessageId = data.messageId || providerMessageId;
        } else {
          sendSuccess = false;
          sendError = JSON.stringify(data);
        }
      } catch (err: any) {
        sendSuccess = false;
        sendError = err.message;
      }
    } else if (
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_PASS !== 'your-smtp-password'
    ) {
      try {
        const cleanedPass = (process.env.SMTP_PASS || '').replace(/\s+/g, '');
        const isGmail = (process.env.SMTP_HOST || '').includes('gmail') || (process.env.SMTP_USER || '').includes('gmail');

        const transporter = isGmail
          ? nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.SMTP_USER,
                pass: cleanedPass,
              },
            })
          : nodemailer.createTransport({
              host: process.env.SMTP_HOST || 'smtp.gmail.com',
              port: parseInt(process.env.SMTP_PORT || '465', 10),
              secure: process.env.SMTP_PORT === '465' || true,
              auth: {
                user: process.env.SMTP_USER,
                pass: cleanedPass,
              },
            });

        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || `Student Club <${process.env.SMTP_USER}>`,
          to: recipientEmail,
          subject,
          html: htmlContent,
        });

        providerMessageId = info.messageId || providerMessageId;
        console.log(`[SMTP Dispatch Success] Email delivered to ${recipientEmail}`);
      } catch (smtpErr: any) {
        sendSuccess = false;
        sendError = smtpErr.message;
        console.error('[SMTP Send Error]:', smtpErr);
      }
    } else {
      // Local / Free Dev Simulation: Try to create an Ethereal preview so user can view the full HTML email
      try {
        const testAccount = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        const info = await transporter.sendMail({
          from: 'Student Club <notifications@studentclub.edu>',
          to: recipientEmail,
          subject,
          html: htmlContent,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info);
        providerMessageId = info.messageId || providerMessageId;

        console.log(`\n================== ✉️ AUTOMATED CLUB EMAIL DISPATCH ==================`);
        console.log(`TYPE: ${type}`);
        console.log(`TO: ${recipientName ? `${recipientName} <${recipientEmail}>` : recipientEmail}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(`EMAIL PREVIEW LINK: ${previewUrl}`);
        console.log(`STATUS: SENT (View complete rendered email at the link above)`);
        console.log(`======================================================================\n`);
      } catch (_devErr) {
        console.log(`\n================== ✉️ AUTOMATED CLUB EMAIL DISPATCH ==================`);
        console.log(`TYPE: ${type}`);
        console.log(`TO: ${recipientName ? `${recipientName} <${recipientEmail}>` : recipientEmail}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(`IDEMPOTENCY: ${idempotencyKey || 'none'}`);
        console.log(`STATUS: SENT (Dev/Free Simulation Mode)`);
        console.log(`======================================================================\n`);
      }
    }

    // 3. Record in EmailLog database table
    await db.emailLog.create({
      data: {
        type,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        recipient_uid: recipientUid,
        subject,
        event_id: eventId,
        registration_id: registrationId,
        status: sendSuccess ? 'SENT' : 'FAILED',
        provider_message_id: providerMessageId,
        error: sendError,
        idempotency_key: idempotencyKey,
      },
    });

    return { success: sendSuccess, error: sendError, messageId: providerMessageId };
  } catch (e: any) {
    console.error('[Email Engine Error]:', e);
    return { success: false, error: e.message };
  }
}

/* ==========================================================================
   11 HIGH-CONVERTING HACKCULTURE HTML EMAIL TEMPLATES
========================================================================== */

/**
 * 1. Account Approval Email (Sent ONLY to approved student)
 */
export async function sendAccountApprovalEmail({
  recipientEmail,
  studentName,
  appUrl,
}: {
  recipientEmail: string;
  studentName: string;
  appUrl?: string;
}) {
  const portalUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const html = buildHackCultureEmail({
    title: 'Your Student Club Account Has Been Approved! 🚀',
    preheader: 'Welcome to Student Club! You now have full access.',
    greetingName: studentName,
    badgeText: '✓ Access Granted',
    badgeColor: '#34d399',
    mainContentHtml: `
      <p>We are delighted to confirm that your student registration has been reviewed and officially approved by the club leadership team!</p>
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-weight: 700; color: #ffffff;">What you can now access:</p>
        <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px;">
          <li style="margin-bottom: 6px;">💡 <strong>Idea Hub</strong> — Incubate student projects and request milestone grants</li>
          <li style="margin-bottom: 6px;">💻 <strong>Coding Arena</strong> — Compete in real-time algorithmic tournaments</li>
          <li style="margin-bottom: 6px;">🗣️ <strong>Soft Skills</strong> — Enter the Mystery Skill League with AI squads</li>
          <li>🤝 <strong>Skill Barter</strong> — Trade skills and book 1-on-1 micro-mentorships</li>
        </ul>
      </div>
      <p>Log in with your credentials to start earning verified credits and climb the collegiate leaderboard!</p>
    `,
    ctaText: 'Access Student Club Dashboard',
    ctaUrl: `${portalUrl}/join`,
    footerNote: 'You will not be asked for approval again on future logins. Enjoy exploring!',
  });

  return sendClubEmail({
    type: 'ACCOUNT_APPROVAL',
    recipientEmail,
    recipientName: studentName,
    subject: 'Your Student Club Account Has Been Approved',
    htmlContent: html,
    idempotencyKey: `ACCOUNT_APPROVED_${recipientEmail}`,
  });
}

/**
 * 2. Login Security Notification Email (Sent ONLY to student who logged in)
 */
export async function sendLoginSecurityEmail({
  recipientEmail,
  studentName,
  device = 'Desktop Computer',
  browser = 'Web Browser',
  time,
  ip = '127.0.0.1',
  reportUrl,
}: {
  recipientEmail: string;
  studentName: string;
  device?: string;
  browser?: string;
  time?: string;
  ip?: string;
  reportUrl?: string;
}) {
  const loginTime = time || new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  const portalUrl = reportUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const html = buildHackCultureEmail({
    title: 'New Sign-In to Student Club 🔒',
    preheader: `Security alert: New sign-in detected at ${loginTime}`,
    greetingName: studentName,
    badgeText: '● Security Notice',
    badgeColor: '#f0b45e',
    mainContentHtml: `
      <p>Your Student Club account was just signed in. Here are the session details:</p>
      <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(240, 180, 94, 0.25); border-radius: 12px; padding: 18px; margin: 18px 0; font-family: monospace; font-size: 13px;">
        <p style="margin: 0 0 6px 0; color: #94a3b8;">Account: <strong style="color: #ffffff;">${recipientEmail}</strong></p>
        <p style="margin: 0 0 6px 0; color: #94a3b8;">Time: <strong style="color: #ffffff;">${loginTime}</strong></p>
        <p style="margin: 0 0 6px 0; color: #94a3b8;">Device: <strong style="color: #ffffff;">${device}</strong></p>
        <p style="margin: 0 0 6px 0; color: #94a3b8;">Browser: <strong style="color: #ffffff;">${browser}</strong></p>
        <p style="margin: 0; color: #94a3b8;">IP Address: <strong style="color: #ffffff;">${ip}</strong></p>
      </div>
      <p style="font-size: 13px; color: #94a3b8;">If this was you, no action is required.</p>
      <p style="font-size: 13px; color: #ef4444;">If you don't recognize this sign-in, please reset your password and contact the Student Club administrator immediately.</p>
    `,
    ctaText: 'View Active Sessions / Secure Account',
    ctaUrl: `${portalUrl}/pending-approval`,
    footerNote: 'This automated notification was generated to protect your club identity and credits.',
  });

  return sendClubEmail({
    type: 'LOGIN_SECURITY',
    recipientEmail,
    recipientName: studentName,
    subject: 'New Sign-In to Student Club',
    htmlContent: html,
  });
}

/**
 * 3. Admin Alert: New Access Request (Sent ONLY to Founder/Admin)
 */
export async function sendAdminAccessRequestEmail({
  adminEmail,
  studentName,
  studentEmail,
  usn,
  role = 'Participant',
  time,
  reviewUrl,
}: {
  adminEmail: string;
  studentName: string;
  studentEmail: string;
  usn?: string | null;
  role?: string;
  time?: string;
  reviewUrl?: string;
}) {
  const reqTime = time || new Date().toLocaleString();
  const portalUrl = reviewUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const html = buildHackCultureEmail({
    title: 'New Student Club Access Request 🔔',
    preheader: `Pending request from ${studentName} (${studentEmail})`,
    badgeText: '● Action Required',
    badgeColor: '#a78bfa',
    mainContentHtml: `
      <p>A new student is requesting access to the Student Club platform:</p>
      <div style="background: rgba(167, 139, 250, 0.08); border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 12px; padding: 18px; margin: 18px 0; font-size: 13px;">
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">Name: <strong style="color: #ffffff;">${studentName}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">Email: <strong style="color: #ffffff;">${studentEmail}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">USN: <strong style="color: #ffffff;">${usn || 'Not provided yet'}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">Role Requested: <strong style="color: #f0b45e;">${role}</strong></p>
        <p style="margin: 0; color: #cbd5e1;">Requested At: <strong style="color: #ffffff;">${reqTime}</strong></p>
      </div>
      <p>Please review this applicant in the Founder Dashboard to approve, reject, or block their access.</p>
    `,
    ctaText: 'Review Pending Access Requests',
    ctaUrl: `${portalUrl}/horizon/workspace?role=founder&section=skill-barter`,
  });

  return sendClubEmail({
    type: 'ADMIN_ALERT',
    recipientEmail: adminEmail,
    subject: 'New Student Club Access Request',
    htmlContent: html,
  });
}

/**
 * 4. New Event Announcement (BROADCAST to ALL approved members)
 */
export async function sendEventAnnouncementEmail({
  recipientEmail,
  studentName,
  eventName,
  date,
  time,
  venue,
  domain,
  credits,
  eventUrl,
  eventId,
}: {
  recipientEmail: string;
  studentName?: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  domain: string;
  credits: number;
  eventUrl?: string;
  eventId?: string;
}) {
  const targetUrl = eventUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/soft-skills`;

  const html = buildHackCultureEmail({
    title: `🎉 New Event Announced — ${eventName}`,
    preheader: `Registrations are now open for ${eventName}! Earn +${credits} credits.`,
    greetingName: studentName,
    badgeText: `⚡ ${domain.replace('_', ' ')} Event`,
    badgeColor: '#38bdf8',
    mainContentHtml: `
      <p>We're excited to announce a new official event from the Student Club!</p>
      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 14px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 12px 0; color: #ffffff; font-size: 18px;">${eventName}</h3>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">📅 Date: <strong>${date}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">⏰ Time: <strong>${time}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">📍 Venue: <strong>${venue}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">🏷️ Domain: <strong>${domain.replace('_', ' ')}</strong></p>
        <p style="margin: 0; color: #34d399; font-weight: 700;">🎁 Credits Reward: +${credits} Verified Credits</p>
      </div>
      <p>Registrations are now open. Don't miss this opportunity to participate, level up, and climb the leaderboard!</p>
    `,
    ctaText: 'View Event & Register',
    ctaUrl: targetUrl,
  });

  return sendClubEmail({
    type: 'EVENT_ANNOUNCEMENT',
    recipientEmail,
    recipientName: studentName,
    subject: `🎉 New Event Announced — ${eventName}`,
    htmlContent: html,
    eventId,
    idempotencyKey: eventId ? `EVENT_PUBLISHED_${eventId}_${recipientEmail}` : undefined,
  });
}

/**
 * 5. Registration Confirmation Email (Sent ONLY to registering student)
 */
export async function sendRegistrationConfirmationEmail({
  recipientEmail,
  studentName,
  eventName,
  date,
  time,
  venue,
  domain,
  credits,
  registrationId,
  eventUrl,
}: {
  recipientEmail: string;
  studentName: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  domain: string;
  credits: number;
  registrationId: string;
  eventUrl?: string;
}) {
  const targetUrl = eventUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/soft-skills`;

  const html = buildHackCultureEmail({
    title: `🎉 Registration Confirmed — ${eventName}`,
    preheader: `Your spot for ${eventName} has been reserved!`,
    greetingName: studentName,
    badgeText: '✓ Confirmed Spot',
    badgeColor: '#34d399',
    mainContentHtml: `
      <p>Your registration for <strong>${eventName}</strong> has been successfully confirmed!</p>
      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 14px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">📅 Date: <strong>${date}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">⏰ Time: <strong>${time}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">📍 Venue: <strong>${venue}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">🏷️ Domain: <strong>${domain.replace('_', ' ')}</strong></p>
        <p style="margin: 0 0 10px 0; color: #34d399; font-weight: 700;">🎁 Eligible Credits: +${credits} Credits</p>
        <p style="margin: 0; font-family: monospace; font-size: 12px; color: #94a3b8;">Registration ID: <span style="color: #ffffff;">${registrationId}</span></p>
      </div>
      <p>We look forward to seeing you there! Make sure to arrive 10 minutes early for check-in.</p>
    `,
    ctaText: 'View My Registration',
    ctaUrl: targetUrl,
  });

  return sendClubEmail({
    type: 'REGISTRATION_CONFIRMATION',
    recipientEmail,
    recipientName: studentName,
    subject: `🎉 Registration Confirmed — ${eventName}`,
    htmlContent: html,
    registrationId,
    idempotencyKey: `REGISTRATION_CONFIRMED_${registrationId}`,
  });
}

/**
 * 6. 3-Day Event Reminder Email (Sent ONLY to registered students)
 */
export async function send3DayReminderEmail({
  recipientEmail,
  studentName,
  eventName,
  date,
  time,
  venue,
  eventUrl,
  registrationId,
}: {
  recipientEmail: string;
  studentName: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  eventUrl?: string;
  registrationId?: string;
}) {
  const targetUrl = eventUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/soft-skills`;

  const html = buildHackCultureEmail({
    title: `🔔 ${eventName} — 3 Days to Go!`,
    preheader: `Reminder: ${eventName} starts in 3 days.`,
    greetingName: studentName,
    badgeText: '● 3 Days Remaining',
    badgeColor: '#a78bfa',
    mainContentHtml: `
      <p>This is a quick reminder that you are registered for <strong>${eventName}</strong> occurring in 3 days!</p>
      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 14px; padding: 18px; margin: 18px 0;">
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">📅 Date: <strong>${date}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">⏰ Time: <strong>${time}</strong></p>
        <p style="margin: 0; color: #cbd5e1;">📍 Venue: <strong>${venue}</strong></p>
      </div>
      <p>Get ready to collaborate, compete, and level up your skills!</p>
    `,
    ctaText: 'View Event Details',
    ctaUrl: targetUrl,
  });

  return sendClubEmail({
    type: 'REMINDER_3DAYS',
    recipientEmail,
    recipientName: studentName,
    subject: `🔔 ${eventName} — 3 Days to Go!`,
    htmlContent: html,
    registrationId,
    idempotencyKey: registrationId ? `REMINDER_3DAYS_${registrationId}` : undefined,
  });
}

/**
 * 7. 1-Day Event Reminder Email (Sent ONLY to registered students)
 */
export async function send1DayReminderEmail({
  recipientEmail,
  studentName,
  eventName,
  date,
  time,
  venue,
  eventUrl,
  registrationId,
}: {
  recipientEmail: string;
  studentName: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  eventUrl?: string;
  registrationId?: string;
}) {
  const targetUrl = eventUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/soft-skills`;

  const html = buildHackCultureEmail({
    title: `🚨 ${eventName} — Tomorrow!`,
    preheader: `Get ready! ${eventName} is happening tomorrow.`,
    greetingName: studentName,
    badgeText: '● Tomorrow',
    badgeColor: '#f43f5e',
    mainContentHtml: `
      <p>The countdown is on! <strong>${eventName}</strong> is happening tomorrow.</p>
      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 14px; padding: 18px; margin: 18px 0;">
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">📅 Date: <strong>${date}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">⏰ Time: <strong>${time}</strong></p>
        <p style="margin: 0; color: #cbd5e1;">📍 Venue: <strong>${venue}</strong></p>
      </div>
      <p>Don't forget to bring your student ID for on-site muster and check-in.</p>
    `,
    ctaText: 'Open Live Arena',
    ctaUrl: targetUrl,
  });

  return sendClubEmail({
    type: 'REMINDER_1DAY',
    recipientEmail,
    recipientName: studentName,
    subject: `🚨 ${eventName} — Tomorrow!`,
    htmlContent: html,
    registrationId,
    idempotencyKey: registrationId ? `REMINDER_1DAY_${registrationId}` : undefined,
  });
}

/**
 * 8. Credit Updated Email (Sent ONLY to student whose credits were approved)
 */
export async function sendCreditUpdatedEmail({
  recipientEmail,
  studentName,
  activityName,
  domain,
  creditsEarned,
  totalCredits,
  creditsUrl,
  idempotencyKey,
}: {
  recipientEmail: string;
  studentName: string;
  activityName: string;
  domain: string;
  creditsEarned: number;
  totalCredits: number;
  creditsUrl?: string;
  idempotencyKey?: string;
}) {
  const targetUrl = creditsUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?tab=profile`;

  const html = buildHackCultureEmail({
    title: '🎉 Your Student Club Credits Have Been Updated!',
    preheader: `You earned +${creditsEarned} credits for ${activityName}! Total: ${totalCredits}`,
    greetingName: studentName,
    badgeText: '● Credits Verified',
    badgeColor: '#34d399',
    mainContentHtml: `
      <p>Your participation in <strong>${activityName}</strong> has been officially verified by the Student Club leadership team.</p>
      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 14px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 11px; font-family: monospace; text-transform: uppercase;">CREDIT UPDATE SUMMARY</p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">🏷️ Domain: <strong>${domain.replace('_', ' ')}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">🎯 Activity: <strong>${activityName}</strong></p>
        <p style="margin: 0 0 8px 0; color: #34d399; font-size: 16px; font-weight: 800;">Credits Earned: +${creditsEarned}</p>
        <p style="margin: 0; color: #f0b45e; font-size: 14px; font-weight: 700;">🌟 New Total Credits: ${totalCredits}</p>
      </div>
      <p>Your verified credits have been successfully added to your profile and reflected in the collegiate leaderboard standings.</p>
    `,
    ctaText: 'View My Credits & Rank',
    ctaUrl: targetUrl,
    footerNote: 'Keep participating, learning, and earning verified credentials!',
  });

  return sendClubEmail({
    type: 'CREDIT_UPDATED',
    recipientEmail,
    recipientName: studentName,
    subject: '🎉 Your Student Club Credits Have Been Updated!',
    htmlContent: html,
    idempotencyKey,
  });
}

/**
 * 9. Leaderboard Updated Email (BROADCAST to ALL approved members)
 */
export async function sendLeaderboardUpdatedEmail({
  recipientEmail,
  studentName,
  leaderboardUrl,
}: {
  recipientEmail: string;
  studentName?: string;
  leaderboardUrl?: string;
}) {
  const targetUrl = leaderboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?tab=competitions`;

  const html = buildHackCultureEmail({
    title: '🏆 Student Club Leaderboard Updated!',
    preheader: 'Check your latest verified ranking and domain breakdown.',
    greetingName: studentName,
    badgeText: '● Official Standings',
    badgeColor: '#f0b45e',
    mainContentHtml: `
      <p>The Student Club official leaderboard has been updated following verified challenge results!</p>
      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(240, 180, 94, 0.3); border-radius: 14px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; color: #ffffff; font-weight: 700;">Four Track Standings Live:</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; color: #cbd5e1;">
          <p style="margin: 4px 0;">💡 Idea Hub</p>
          <p style="margin: 4px 0;">💻 Coding League</p>
          <p style="margin: 4px 0;">🗣️ Soft Skills</p>
          <p style="margin: 4px 0;">🤝 Skill Barter</p>
        </div>
      </div>
      <p>Check your latest scores, see how you rank among your peers, and take on new challenges to climb to the top.</p>
    `,
    ctaText: 'View Official Leaderboard',
    ctaUrl: targetUrl,
  });

  return sendClubEmail({
    type: 'LEADERBOARD_UPDATED',
    recipientEmail,
    recipientName: studentName,
    subject: '🏆 Student Club Leaderboard Updated!',
    htmlContent: html,
  });
}

/**
 * 10. Admin Announcement Email (Sent to targeted audience)
 */
export async function sendAdminAnnouncementEmail({
  recipientEmail,
  studentName,
  title,
  message,
  ctaText,
  ctaUrl,
}: {
  recipientEmail: string;
  studentName?: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
}) {
  const targetUrl = ctaUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/horizon`;

  const html = buildHackCultureEmail({
    title,
    preheader: title,
    greetingName: studentName,
    badgeText: '● Club Announcement',
    badgeColor: '#a78bfa',
    mainContentHtml: `
      <div style="white-space: pre-line; line-height: 1.6;">
        ${message}
      </div>
    `,
    ctaText: ctaText || 'View Announcement',
    ctaUrl: targetUrl,
  });

  return sendClubEmail({
    type: 'ADMIN_ANNOUNCEMENT',
    recipientEmail,
    recipientName: studentName,
    subject: title,
    htmlContent: html,
  });
}

/**
 * 11. Volunteer Access Started Email (Sent ONLY to finalized volunteers)
 */
export async function sendVolunteerAccessStartedEmail({
  recipientEmail,
  studentName,
  eventName,
  date,
  time,
  venue,
  volunteerDashboardUrl,
  eventId,
}: {
  recipientEmail: string;
  studentName: string;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  volunteerDashboardUrl?: string;
  eventId?: string;
}) {
  const targetUrl = volunteerDashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/horizon/workspace?role=ambassador&section=coding-challenge`;

  const html = buildHackCultureEmail({
    title: `🚀 Volunteer Access Started — ${eventName}`,
    preheader: `Volunteer access for ${eventName} is now active!`,
    greetingName: studentName,
    badgeText: '★ Volunteer Command Active',
    badgeColor: '#f472b6',
    mainContentHtml: `
      <p>Volunteer operations for <strong>${eventName}</strong> have officially been initiated by the club coordinator!</p>
      <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(244, 114, 182, 0.3); border-radius: 14px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">🎯 Event: <strong>${eventName}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">📅 Date: <strong>${date}</strong></p>
        <p style="margin: 0 0 6px 0; color: #cbd5e1;">⏰ Time: <strong>${time}</strong></p>
        <p style="margin: 0 0 10px 0; color: #cbd5e1;">📍 Venue: <strong>${venue}</strong></p>
        <p style="margin: 0; color: #f472b6; font-size: 13px; font-weight: 700;">Status: Access Permitted (On-Duty)</p>
      </div>
      <p>You can now open the Volunteer Dashboard to manage check-ins, verify attendee rosters, and coordinate live rounds.</p>
    `,
    ctaText: 'Open Volunteer Dashboard',
    ctaUrl: targetUrl,
    footerNote: 'Thank you for supporting the Student Club ecosystem!',
  });

  return sendClubEmail({
    type: 'VOLUNTEER_ACCESS_STARTED',
    recipientEmail,
    recipientName: studentName,
    subject: `🚀 Volunteer Access Started — ${eventName}`,
    htmlContent: html,
    eventId,
    idempotencyKey: eventId ? `VOLUNTEER_ACCESS_${eventId}_${recipientEmail}` : undefined,
  });
}

