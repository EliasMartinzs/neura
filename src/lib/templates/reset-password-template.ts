export function resetPasswordTemplate(name: string, url: string) {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>Resetar minha senha</title>
    </head>
    <body style="font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f7f7f7;padding:40px 0;">
      <div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
        <h1 style="color:#111827;margin-bottom:16px;">Olá, ${name}!</h1>
        <p style="font-size:16px;color:#374151;margin-bottom:24px;">
          Para ativar sua conta, clique no botão abaixo para verificar seu e-mail:
        </p>
        <a href="${url}" style="display:inline-block;padding:12px 24px;background-color:#4F46E5;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
          Resetar minha senha
        </a>
        <p style="font-size:14px;color:#6B7280;margin-top:24px;">
          Se você não solicitou, ignore este e-mail.
        </p>
      </div>
    </body>
  </html>
  `;
}
