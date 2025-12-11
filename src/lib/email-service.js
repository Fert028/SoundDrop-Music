import nodemailer from 'nodemailer';

// Development transporter (вывод в консоль)
const developmentTransporter = {
  sendMail: async (options) => {
    console.log('📧 Email отправлен:');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('HTML:', options.html);
    console.log('---');
    return { messageId: 'dev-' + Date.now() };
  }
};

// Production transporter (настройте под вашу почтовую службу)
const createProductionTransporter = () => {
  // Если нет SMTP настроек, используем development режим
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('⚠️ SMTP не настроен, используем development режим');
    return developmentTransporter;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

const transporter = process.env.NODE_ENV === 'production' 
  ? createProductionTransporter() 
  : developmentTransporter;

export async function sendEmail({ to, subject, html }) {
  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Student Auth" <noreply@studentauth.com>',
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${result.messageId}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
}

// Шаблоны писем
export const emailTemplates = {
  verification: (verificationUrl, name) => ({
    subject: 'Подтвердите ваш email адрес',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Подтверждение email адреса</h2>
        <p>Здравствуйте${name ? `, ${name}` : ''}!</p>
        <p>Для завершения регистрации и подтверждения вашего email адреса, пожалуйста, перейдите по ссылке ниже:</p>
        <p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px;">
            Подтвердить email
          </a>
        </p>
        <p>Если вы не регистрировались в нашем сервисе, просто проигнорируйте это письмо.</p>
        <p><small>Ссылка действительна в течение 24 часов.</small></p>
      </div>
    `
  }),

  passwordReset: (resetUrl, name) => ({
    subject: 'Восстановление пароля',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Восстановление пароля</h2>
        <p>Здравствуйте${name ? `, ${name}` : ''}!</p>
        <p>Мы получили запрос на восстановление пароля для вашего аккаунта.</p>
        <p>Для установки нового пароля перейдите по ссылке ниже:</p>
        <p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px;">
            Восстановить пароль
          </a>
        </p>
        <p>Если вы не отправляли запрос на восстановление пароля, просто проигнорируйте это письмо.</p>
        <p><small>Ссылка действительна в течение 1 часа.</small></p>
      </div>
    `
  })
};


// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT),
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// export async function sendVerificationEmail(email, token) {
//   const verificationUrl = '${process.env.NEXTAUTH_URL}/auth/verification?token=${token}';

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject: "Подтверждение Email",
//     html: `
//       <h1>Подтвердите ваш email</h1>
//       <p>Чтобы активировать аккаунт, нажмите кнопку ниже:</p>
//       <a href="${verificationUrl}" 
//          style="display:inline-block;
//                 padding:10px 20px;
//                 background:#4f46e5;
//                 color:white;
//                 text-decoration:none;
//                 border-radius:6px;">
//         Подтвердить email
//       </a>
//       <p>Если вы не регистрировались, просто игнорируйте это письмо.</p>
//     `
//   });
// }