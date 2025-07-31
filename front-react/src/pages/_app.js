import "@/styles/globals.css";
import { RegisterProvider } from "@/context/RegisterContext";
import { useEffect } from "react";

// Componente de segurança para limpar token ao fechar página
function SecurityProvider({ children }) {
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Limpa o token quando a página é fechada
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioCamarize');
    };

    const handleVisibilityChange = () => {
      // Limpa o token quando a aba fica oculta por muito tempo (30 minutos)
      if (document.hidden) {
        setTimeout(() => {
          if (document.hidden) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioCamarize');
          }
        }, 30 * 60 * 1000); // 30 minutos
      }
    };

    // Adiciona os event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup dos event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return children;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <SecurityProvider>
      <RegisterProvider>
        <Component {...pageProps} />
      </RegisterProvider>
    </SecurityProvider>
  );
}
