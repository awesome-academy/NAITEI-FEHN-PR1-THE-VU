import { useState, useEffect } from "react";
import Plant from "../components/Plant";
import MobilePlant from "../components/MobilePlant";
import PlantSmall from "../components/PlantSmall";
import Banner from "../assets/banner.png";
import New from "../components/New";
import Slider from "../components/Slider";
import SectionHeading from "../components/SectionHeading";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Navigate } from "react-router";
import { toast } from "react-toastify";
import { AuthEvents } from "../components/Header";
import axios from "axios";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState({});
  const [news, setNews] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const products = {};
    const fetchData = async () => {
      try {
        const outstandingProductsAPI =
          "http://localhost:5000/trees?_sort=-average_rating&_limit=6";
        const bestSellerProductAPI =
          "http://localhost:5000/trees?_sort=-bought&_limit=6";
        const newProductsAPI =
          "http://localhost:5000/trees?_sort=-created_at&_limit=8";
        const discountProductsAPI =
          "http://localhost:5000/trees?is_new=false&_limit=6";
        const newsAPI = "http://localhost:5000/news?_sort=-created_at&_limit=3";

        const [
          outstandingProducts,
          bestSellerProducts,
          newProducts,
          discountProducts,
          news,
        ] = await Promise.all([
          fetch(outstandingProductsAPI).then((res) => res.json()),
          fetch(bestSellerProductAPI).then((res) => res.json()),
          fetch(newProductsAPI).then((res) => res.json()),
          fetch(discountProductsAPI).then((res) => res.json()),
          fetch(newsAPI).then((res) => res.json()),
        ]);

        products.outstandingProducts = outstandingProducts;
        products.bestSellerProducts = bestSellerProducts;
        products.newProducts = newProducts;
        products.discountProducts = discountProducts;

        setProducts(products);
        setNews(news);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Lỗi khi đọc thông tin người dùng:", error);
      }
    }
  }, []);

  const handleAddToCart = async (plant) => {
    if (!currentUser) {
      sessionStorage.setItem(
        "lastViewedProduct",
        JSON.stringify({
          id: plant.id,
          quantity: 1,
        }),
      );

      toast.info("Vui lòng đăng nhập để mua hàng");
      Navigate("/login");
      return;
    }

    setAddingToCart(true);

    try {
      const cartResponse = await axios.get(
        `http://localhost:5000/orders?user_id=${currentUser.id}&status=trong giỏ hàng`,
      );

      let cartId;
      let currentCart;

      if (cartResponse.data.length === 0) {
        const newCart = {
          user_id: currentUser.id,
          user_name: currentUser.name,
          status: "trong giỏ hàng",
          trees: [],
          address: "",
          phone: currentUser.phone || "",
          created_at: new Date().toISOString(),
          total: 0,
        };

        const createResponse = await axios.post(
          "http://localhost:5000/orders",
          newCart,
        );
        cartId = createResponse.data.id;
        currentCart = createResponse.data;
      } else {
        currentCart = cartResponse.data[0];
        cartId = currentCart.id;
      }

      const existingProductIndex = currentCart.trees.findIndex(
        (item) => item.id === plant.id,
      );

      let updatedTrees = [...currentCart.trees];
      let updatedTotal = currentCart.total;

      if (existingProductIndex >= 0) {
        updatedTrees[existingProductIndex].quantity += 1;
      } else {
        updatedTrees.push({
          id: plant.id,
          name: plant.name,
          price: plant.price,
          image: plant.image[0],
          quantity: 1,
        });
      }

      updatedTotal = updatedTrees.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      await axios.patch(`http://localhost:5000/orders/${cartId}`, {
        trees: updatedTrees,
        total: updatedTotal,
      });

      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      AuthEvents.publish("cart-update", null);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Slider />
      <div className="max-w-5xl mx-auto mt-10 sm:mt-16 px-2.5">
        {/* San pham noi bat */}
        <div className="mb-6">
          <SectionHeading heading="Sản phẩm nổi bật" />
          <MobilePlant
            disabled={addingToCart}
            onClick={handleAddToCart}
            plants={products.outstandingProducts}
          />
          <div className="hidden sm:grid grid-flow-col grid-cols-2 gap-2 md:gap-4 mx-auto">
            <div className="col-span-1 inline-grid grid-cols-2 gap-2 md:gap-4">
              <div className="col-span-2 w-full">
                <Plant
                  disabled={addingToCart}
                  onClick={handleAddToCart}
                  plant={products.outstandingProducts[0]}
                />
              </div>

              <div className="col-span-2 inline-grid grid-cols-2 gap-2 md:gap-4">
                <div className="col-span-1">
                  <Plant
                    disabled={addingToCart}
                    onClick={handleAddToCart}
                    plant={products.outstandingProducts[1]}
                  />
                </div>
                <div className="col-span-1">
                  <Plant
                    disabled={addingToCart}
                    onClick={handleAddToCart}
                    plant={products.outstandingProducts[2]}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-1 inline-grid grid-cols-2 gap-2 md:gap-4">
              <div className="col-span-2 inline-grid grid-cols-2 gap-2 md:gap-4">
                <div className="col-span-1">
                  <Plant
                    disabled={addingToCart}
                    onClick={handleAddToCart}
                    plant={products.outstandingProducts[3]}
                  />
                </div>
                <div className="col-span-1">
                  <Plant
                    disabled={addingToCart}
                    onClick={handleAddToCart}
                    plant={products.outstandingProducts[4]}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <Plant
                  disabled={addingToCart}
                  onClick={handleAddToCart}
                  plant={products.outstandingProducts[5]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* San pham mua nhieu, san pham khuyen mai */}
        <div className="mb-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            <div className="col-span-4 sm:col-span-1">
              <SectionHeading heading="Sản phẩm mua nhiều" />
              <ul className="grid gap-4 sm:gap-0.5">
                {products.bestSellerProducts.map((product) => (
                  <li key={product.id}>
                    <PlantSmall plant={product} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3">
              <SectionHeading heading="Sản phẩm khuyến mại" />
              <MobilePlant
                disabled={addingToCart}
                onClick={handleAddToCart}
                plants={products.discountProducts}
              />
              <ul className="hidden sm:grid grid-cols-3 gap-4">
                {products.discountProducts.map((plant) => (
                  <li key={plant.id}>
                    <Plant
                      disabled={addingToCart}
                      onClick={handleAddToCart}
                      plant={plant}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <img src={Banner} alt="#" className="w-full mb-6" />

        {/* San pham moi */}
        <div className="mb-8">
          <div className="border-b-1 border-gray-400 relative mt-12 my-6 flex flex-col justify-between">
            <h4 className="absolute bottom-[-3px] left-0 text-main border-b-4 border-main inline-block font-extrabold text-lg py-2">
              Sản phẩm mới
            </h4>

            <div className="flex items-center justify-end pb-1">
              <button className="rounded-full bg-gray-300 hover:bg-gray-200 cursor-pointer p-2 mr-2">
                <ChevronLeftIcon className="size-3" />
              </button>
              <button className="rounded-full bg-gray-300 hover:bg-gray-200 cursor-pointer p-2">
                <ChevronRightIcon className="size-3" />
              </button>
            </div>
          </div>
          <MobilePlant
            disabled={addingToCart}
            onClick={handleAddToCart}
            plants={products.newProducts}
          />

          <ul className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {products.newProducts.map((product) => (
              <li key={product.id}>
                <Plant
                  disabled={addingToCart}
                  onClick={handleAddToCart}
                  plant={product}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Tin tuc */}
        <div className="mb-6">
          <SectionHeading heading="Tin tức" />
          <ul className="grid sm:grid-cols-3 gap-4">
            {news.map((singleNew) => (
              <li className="grid-cols-1" key={singleNew.id}>
                <New singleNew={singleNew} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
