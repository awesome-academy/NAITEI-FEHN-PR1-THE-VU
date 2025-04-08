import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function NewsListSideBar({ tags, selectedTags, onTagClick }) {
  const [outstandingNews, setOutstandingNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchNews = async () => {
        try {
          setLoading(true);
          const [news, categories] = await Promise.all([
            fetch("http://localhost:5000/news?_sort=-created_at").then((res) => res.json()),
            fetch("http://localhost:5000/categories").then((res) => res.json()),
          ]);

          const outStandingNews = news.slice().sort((a, b) => b?.comments.length - a?.comments.length).slice(0, 5);

          setOutstandingNews(outStandingNews);
          setCategories(categories);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchNews();
    }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="mb-20">
        <SectionHeading heading="Danh mục sản phẩm" />
        <ul className="text-sm">
          {categories.map((category, id) => (
            <li key={id} className="hover:text-hover cursor-pointer mb-1.5 flex items-center justify-start border-b border-gray-400 pb-1.5">
              <span className="mr-1"><ChevronRightIcon className="size-3" /></span>
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-20">
        <SectionHeading heading="Tin tức nổi bật" />
        <ul>
          {outstandingNews.map((news) => (
            <li key={news.id}>
              <a href={`/new/${news.id}`} className="flex items-start mb-2 bg-gray-50 rounded">
                <img src={news.cover} alt="" className="size-14 mr-2 rounded-l" />
                <p className="text-[0.65rem] font-beVietNamPro mt-0.5 text-gray-900 hover:text-hover">{news.title}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <SectionHeading heading="Blog tag" />
        <ul className="gap-2 flex flex-wrap">
          {tags.map((tag, id) => (
            <li
              key={id}
              className={`border py-1.5 px-3 text-[0.6rem] cursor-pointer ${selectedTags.includes(tag) ? 'bg-main text-white' : ""} hover:bg-main hover:text-white`}
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
