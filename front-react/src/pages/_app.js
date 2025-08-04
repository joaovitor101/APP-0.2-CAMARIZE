import "@/styles/globals.css";
import { RegisterProvider } from "@/context/RegisterContext";
import Head from "next/head";

// Componente de segurança (removida limpeza automática do token)
function SecurityProvider({ children }) {
  // Removida a limpeza automática do token para não interferir no fluxo normal
  return children;
}

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <SecurityProvider>
        <RegisterProvider>
          <Component {...pageProps} />
        </RegisterProvider>
      </SecurityProvider>
    </>
  );
}
