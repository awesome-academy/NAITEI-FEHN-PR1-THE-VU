import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from 'react-redux';
import { store } from './store';
import "./index.css";
import App from "./App.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProductList from "./pages/ProductList.jsx";
import RequestPlant from "./pages/RequestPlant.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Statistics from "./pages/Statistics.jsx";
import HistoryOrder from "./pages/HistoryOrder.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<h1>Login</h1>} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/request-plant" element={<RequestPlant />} />
            <Route path="/order-history" element={<HistoryOrder />} /> 
          </Route>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Statistics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
