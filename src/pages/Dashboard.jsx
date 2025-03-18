import { useState, useEffect } from "react";
import Plant from "../components/Plant";
import MobilePlant from "../components/MobilePlant";
import PlantSmall from "../components/PlantSmall";
import Banner from "../assets/banner.png";
import New from "../components/New";
import Slider from "../components/Slider";
import SectionHeading from "../components/SectionHeading";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function Dashboard() {
  const [products, setProducts] = useState({});
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const products = {};
    const fetchData = async () => {
      try {
        const outstandingProductsAPI =
          "http://localhost:3000/trees?_sort=-average_rating&_limit=6";
        const bestSellerProductAPI =
          "http://localhost:3000/trees?_sort=-bought&_limit=6";
        const newProductsAPI =
          "http://localhost:3000/trees?_sort=-created_at&_limit=8";
        const discountProductsAPI =
          "http://localhost:3000/trees?is_new=false&_limit=6";
        const newsAPI = "http://localhost:3000/news?_sort=-created_at&_limit=3";

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Slider />
      <div className="max-w-5xl mx-auto mt-10 sm:mt-16 px-2.5">
        {/* San pham noi bat */}
        <div className="mb-6">
          <SectionHeading heading="Sản phẩm nổi bật" />
          <MobilePlant plants={products.outstandingProducts} />
          <div className="hidden sm:grid grid-flow-col grid-cols-2 gap-2 md:gap-4 mx-auto">
            <div className="col-span-1 inline-grid grid-cols-2 gap-2 md:gap-4">
              <div className="col-span-2 w-full">
                <Plant plant={products.outstandingProducts[0]} />
              </div>

              <div className="col-span-2 inline-grid grid-cols-2 gap-2 md:gap-4">
                <div className="col-span-1">
                  <Plant plant={products.outstandingProducts[1]} />
                </div>
                <div className="col-span-1">
                  <Plant plant={products.outstandingProducts[2]} />
                </div>
              </div>
            </div>

            <div className="col-span-1 inline-grid grid-cols-2 gap-2 md:gap-4">
              <div className="col-span-2 inline-grid grid-cols-2 gap-2 md:gap-4">
                <div className="col-span-1">
                  <Plant plant={products.outstandingProducts[3]} />
                </div>
                <div className="col-span-1">
                  <Plant plant={products.outstandingProducts[4]} />
                </div>
              </div>
              <div className="col-span-2">
                <Plant plant={products.outstandingProducts[5]} />
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
              <MobilePlant plants={products.discountProducts} />
              <ul className="hidden sm:grid grid-cols-3 gap-4">
                {products.discountProducts.map((plant) => (
                  <li key={plant.id}>
                    <Plant plant={plant} />
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
          <MobilePlant plants={products.newProducts} />

          <ul className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {products.newProducts.map((product) => (
              <li key={product.id}>
                <Plant plant={product} />
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
