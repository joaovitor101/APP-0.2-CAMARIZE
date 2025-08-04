import "@/styles/globals.css";
import { RegisterProvider } from "@/context/RegisterContext";
import { useEffect } from "react";

// Componente de segurança (removida limpeza automática do token)
function SecurityProvider({ children }) {
  // Removida a limpeza automática do token para não interferir no fluxo normal
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
