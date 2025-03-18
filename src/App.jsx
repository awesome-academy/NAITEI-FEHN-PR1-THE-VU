import Footer from "./components/Footer";
import Header from "./components/Header";
import WelcomePopup from "./components/WelcomePopup";

function App() {
  return (
    <>
      <Header />
      <p className="text-red-500">PJ1</p>
      <div className="h-[500px] bg-gray-100"></div>
      <Footer />
      <WelcomePopup />
    </>
  );
}

export default App;
