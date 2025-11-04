interface VerifyEmailProps {
  url: string;
  name: string;
}

export const VerifyEmail = ({ url, name }: VerifyEmailProps) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f7f7f7",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "auto",
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ color: "#111827", textAlign: "center" }}>
          Verifique seu e-mail
        </h1>
        <p style={{ fontSize: "16px", color: "#374151" }}>
          Olá, <strong>{name}</strong> 👋
        </p>
        <p style={{ fontSize: "16px", color: "#374151" }}>
          Clique no botão abaixo para confirmar seu endereço de e-mail e ativar
          sua conta.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            backgroundColor: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Verificar e-mail
        </a>
        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Se você não criou uma conta, ignore este e-mail.
        </p>
      </div>
    </div>
  );
};
