import { sendProductionEmail } from './resend-service';

// Development transporter (вывод в консоль)
const developmentTransporter = {
  sendMail: async (options) => {
    console.log('📧 Email отправлен (DEV):');
    console.log('To:', options.to);
    console.log('Subject:', options.subject);
    console.log('HTML:', options.html);
    console.log('---');
    console.log('🔗 Ссылки для тестирования:');
    
    const linkMatches = options.html.match(/href="([^"]*)"/g);
    if (linkMatches) {
      linkMatches.forEach((match, index) => {
        const url = match.replace('href="', '').replace('"', '');
        console.log(`Ссылка ${index + 1}: ${url}`);
      });
    }
    console.log('---');
    
    return { messageId: 'dev-' + Date.now() };
  }
};

// Выбираем транспортер в зависимости от среды
const getTransporter = () => {
  if (process.env.NODE_ENV === 'production' && process.env.RESEND_API_KEY) {
    return {
      sendMail: async (options) => {
        return await sendProductionEmail(options.to, options.subject, options.html);
      }
    };
  }
  return developmentTransporter;
};

const transporter = getTransporter();

export async function sendEmail({ to, subject, html }) {
  try {
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Student Auth" <noreply@studentauth.com>',
      to,
      subject,
      html,
    });

    if (process.env.NODE_ENV === 'production') {
      console.log(`✅ Production email sent to ${to}: ${result.messageId}`);
    } else {
      console.log(`✅ Development email logged for ${to}`);
    }
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error };
  }
}

// Шаблоны писем (остаются без изменений)
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