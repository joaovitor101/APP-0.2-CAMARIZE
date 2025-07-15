import "@/styles/globals.css";
import { RegisterProvider } from "@/context/RegisterContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <RegisterProvider>
      <Component {...pageProps} />
    </RegisterProvider>
  );
}
