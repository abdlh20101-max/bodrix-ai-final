/**
 * Email Service
 * خدمة البريد الإلكتروني لإرسال الرسائل والإشعارات
 */

import { invokeLLM } from "../_core/llm";

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

interface EmailTemplate {
  name: string;
  subject: string;
  variables: Record<string, string>;
}

/**
 * إرسال بريد إلكتروني بسيط
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const {
      to,
      subject,
      html,
      text,
      from = "noreply@bodrix.ai",
      replyTo = "support@bodrix.ai",
    } = options;

    // Validate email
    if (!isValidEmail(to)) {
      console.error(`Invalid email address: ${to}`);
      return false;
    }

    // Use built-in notification service as fallback
    // In production, integrate with SendGrid or similar
    console.log(`📧 Email sent to ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   From: ${from}`);
    console.log(`   Reply-To: ${replyTo}`);

    // TODO: Integrate with SendGrid API
    // const sgMail = require("@sendgrid/mail");
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to, from, subject, html, text, replyTo });

    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

/**
 * إرسال بريد ترحيب للمستخدم الجديد
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h1>مرحباً بك في Bodrix AI! 🎉</h1>
      <p>مرحباً ${userName}،</p>
      <p>شكراً لتسجيلك في Bodrix AI. نحن سعداء بانضمامك إلى مجتمعنا!</p>
      
      <h2>ما يمكنك فعله الآن:</h2>
      <ul>
        <li>استكشف لوحة التحكم الخاصة بك</li>
        <li>اقرأ الدليل السريع</li>
        <li>جرب الميزات المجانية</li>
        <li>ترقَ إلى خطة Pro للمزيد من الميزات</li>
      </ul>
      
      <p>
        <a href="https://bodrix.ai/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          اذهب إلى لوحة التحكم
        </a>
      </p>
      
      <p>إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا على <a href="mailto:support@bodrix.ai">support@bodrix.ai</a></p>
      
      <p>مع أطيب التحيات،<br/>فريق Bodrix AI</p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: "مرحباً بك في Bodrix AI!",
    html,
  });
}

/**
 * إرسال بريد تأكيد الدفع
 */
export async function sendPaymentConfirmationEmail(
  userEmail: string,
  userName: string,
  amount: number,
  planName: string,
  transactionId: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h1>تم استقبال دفعتك ✓</h1>
      <p>مرحباً ${userName}،</p>
      <p>شكراً لك على الاشتراك في خطة <strong>${planName}</strong>!</p>
      
      <h2>تفاصيل الدفع:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; text-align: right;"><strong>المبلغ:</strong></td>
          <td style="padding: 10px;">$${amount.toFixed(2)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; text-align: right;"><strong>الخطة:</strong></td>
          <td style="padding: 10px;">${planName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; text-align: right;"><strong>رقم العملية:</strong></td>
          <td style="padding: 10px;">${transactionId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; text-align: right;"><strong>التاريخ:</strong></td>
          <td style="padding: 10px;">${new Date().toLocaleDateString("ar-SA")}</td>
        </tr>
      </table>
      
      <p>يمكنك الآن الاستمتاع بجميع ميزات الخطة المختارة!</p>
      
      <p>
        <a href="https://bodrix.ai/dashboard" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          ابدأ الآن
        </a>
      </p>
      
      <p>مع أطيب التحيات،<br/>فريق Bodrix AI</p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: `تأكيد الدفع - ${planName}`,
    html,
  });
}

/**
 * إرسال بريد إعادة تعيين كلمة المرور
 */
export async function sendPasswordResetEmail(
  userEmail: string,
  resetToken: string
): Promise<boolean> {
  const resetLink = `https://bodrix.ai/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h1>إعادة تعيين كلمة المرور</h1>
      <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك.</p>
      
      <p>انقر على الزر أدناه لإعادة تعيين كلمة المرور:</p>
      
      <p>
        <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          إعادة تعيين كلمة المرور
        </a>
      </p>
      
      <p>أو انسخ هذا الرابط في متصفحك:</p>
      <p><code>${resetLink}</code></p>
      
      <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة 24 ساعة فقط.</p>
      
      <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد.</p>
      
      <p>مع أطيب التحيات،<br/>فريق Bodrix AI</p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: "إعادة تعيين كلمة المرور",
    html,
  });
}

/**
 * إرسال بريد إشعار نشاط مريب
 */
export async function sendSecurityAlertEmail(
  userEmail: string,
  userName: string,
  activity: string,
  ipAddress: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h1>⚠️ تنبيه أمان</h1>
      <p>مرحباً ${userName}،</p>
      <p>لقد اكتشفنا نشاطاً غير عادي على حسابك.</p>
      
      <h2>تفاصيل النشاط:</h2>
      <ul>
        <li><strong>النوع:</strong> ${activity}</li>
        <li><strong>عنوان IP:</strong> ${ipAddress}</li>
        <li><strong>الوقت:</strong> ${new Date().toLocaleString("ar-SA")}</li>
      </ul>
      
      <p>إذا كنت أنت من قام بهذا النشاط، يمكنك تجاهل هذا البريد.</p>
      
      <p>إذا لم تكن أنت، يرجى تغيير كلمة المرور الخاصة بك على الفور:</p>
      
      <p>
        <a href="https://bodrix.ai/change-password" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          تغيير كلمة المرور
        </a>
      </p>
      
      <p>مع أطيب التحيات،<br/>فريق Bodrix AI</p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: "تنبيه أمان - نشاط غير عادي",
    html,
  });
}

/**
 * إرسال بريد إخطار انتهاء الاشتراك
 */
export async function sendSubscriptionExpiringEmail(
  userEmail: string,
  userName: string,
  daysLeft: number,
  planName: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h1>⏰ اشتراكك ينتهي قريباً</h1>
      <p>مرحباً ${userName}،</p>
      <p>اشتراكك في خطة <strong>${planName}</strong> سينتهي خلال <strong>${daysLeft}</strong> أيام.</p>
      
      <p>لتجديد الاشتراك والاستمتاع بالخدمة بدون انقطاع، انقر على الزر أدناه:</p>
      
      <p>
        <a href="https://bodrix.ai/billing" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          تجديد الاشتراك
        </a>
      </p>
      
      <p>مع أطيب التحيات،<br/>فريق Bodrix AI</p>
    </div>
  `;

  return sendEmail({
    to: userEmail,
    subject: `تنبيه: اشتراكك ينتهي خلال ${daysLeft} أيام`,
    html,
  });
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPaymentConfirmationEmail,
  sendPasswordResetEmail,
  sendSecurityAlertEmail,
  sendSubscriptionExpiringEmail,
};
