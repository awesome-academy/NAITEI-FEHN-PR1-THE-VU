import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import ProductDetail from "./components/ProductDetail.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
