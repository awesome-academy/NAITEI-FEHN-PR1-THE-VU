import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import WelcomePopup from "./components/WelcomePopup";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <WelcomePopup />
    </>
  );
}

export default App;
