import { HomeIcon } from "@heroicons/react/24/solid";
import { Breadcrumb, Pagination } from "antd";
import { useEffect, useState } from "react";
import NewPreview from "../components/NewPreview";
import NewsListSideBar from "../components/NewsListSideBar";

export default function NewsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [news, setNews] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allTags = [...new Set(news.flatMap((neww) => neww.tags))];
  const filteredNews =
    selectedTags.length > 0
      ? news.filter((item) =>
          selectedTags.every((tag) => item.tags.includes(tag)),
        )
      : news;

  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return <a>Trang trước</a>;
    }
    if (type === "next") {
      return <a>Trang sau</a>;
    }
    return originalElement;
  };

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/news?_sort=-created_at",
        );
        const data = await response.json();
        setNews(data);
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
      <div className="max-w-5xl mx-auto mt-4 px-2.5">
        <Breadcrumb
          items={[
            {
              title: (
                <a href="/">
                  <div className="flex items-center justify-center ml-1">
                    <HomeIcon className="size-3 mr-1" /> Home
                  </div>
                </a>
              ),
            },
            { title: "Tin tức" },
          ]}
        />

        <div className="grid grid-cols-4 gap-8">
          <div className="hidden min-[945px]:block col-span-1">
            <NewsListSideBar
              tags={allTags}
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
            />
          </div>

          <div className="col-span-4 min-[945px]:col-span-3 pt-4 flex flex-col gap-6">
            {filteredNews
              .slice((currentPage - 1) * 3, currentPage * 3)
              .map((neww) => (
                <NewPreview key={neww.id} news={neww} />
              ))}
          </div>
        </div>

        <div className="flex justify-end my-4">
          <Pagination
            current={currentPage}
            total={filteredNews.length}
            pageSize={3}
            itemRender={itemRender}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
}
