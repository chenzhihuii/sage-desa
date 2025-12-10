import { StrictMode } from "react";
import { createRoot } from "react-dom/client"; // Pastikan import createRoot dari react-dom/client
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Homepage from "./pages/Homepage.jsx";
import About from "./pages/About.jsx";
import Charts from "./pages/Charts.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Contact from "./pages/Contact.jsx";
import Chatbot from "./pages/Chatbot.jsx";
import CropsData from "./pages/CropsData.jsx";
import Connect from "./pages/Connect.jsx";
import Gallery from "./pages/Gallery.jsx";
import Eksplorasi from "./pages/Eksplorasi.jsx";
import Prediksi from "./pages/Prediksi.jsx";
import Rekomendasi from "./pages/Rekomendasi.jsx";

// --- TES DIAGNOSTIK UNTUK MEMASTIKAN API KEY TERBACA (HAPUS SETELAH BERHASIL) ---
// Cek terminal saat npm run dev, nilainya harus muncul!
// console.log("Nilai API Key yang Dibaca Vite:", import.meta.env.VITE_GEMINI_API_KEY);
// ---------------------------------------------------------------------------------

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/About",
    element: <About />,
  },
  {
    path: "/Charts",
    element: <Charts />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/chatbot",
    element: <Chatbot />,
  },
  {
    path: "/cropdata",
    element: <CropsData />,
  },
  {
    path: "/Expert",
    element: <Connect />,
  },
  {
    path: "/gallery",
    element: <Gallery />,
  },
  {
    path: "/eksplorasi",
    element: <Eksplorasi />,
  },
  {
    path: "/prediksi",
    element: <Prediksi />,
  },
  {
    path: "/rekomendasi",
    element: <Rekomendasi />,
  },
  {
    // Rute Wildcard untuk menangani halaman yang tidak ditemukan (Error 404)
    path: "*",
    element: <ErrorPage />,
  },
]);

// Pastikan elemen root diambil dengan benar
const rootElement = document.getElementById("root");

// Hanya render jika elemen root ditemukan
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
