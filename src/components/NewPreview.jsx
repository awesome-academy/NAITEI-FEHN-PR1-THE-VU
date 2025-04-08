import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function NewPreview({ news }) {
  return (
    <a href={`/new/${news.id}`} className="">
      <h3 className="hover:text-hover cursor-pointer">{news.title}</h3>
      <div className="flex text-xs text-gray-600 mt-2 mb-4">
        <span className="mr-2 flex items-center justify-center">
          <CalendarDaysIcon className="size-4 mr-1 text-main" />
          {new Date(news.created_at).toLocaleDateString("vi-VN")}
        </span>
        <span className="mr-2 flex items-center justify-center">
          <ClockIcon className="size-4 mr-1 text-main" />
          {new Date(news.created_at).toLocaleTimeString("vi-VN")}
        </span>
        <span className="mr-2 flex items-center justify-center">
          <ChatBubbleOvalLeftEllipsisIcon className="size-4 mr-1 text-main" />
          {news.comments.length} bình luận
        </span>
      </div>

      <img
        src={news.cover}
        alt={news.title}
        className="max-h-96 w-full object-cover object-center hover:opacity-80"
      />
      <p className="text-sm mt-4 mb-8 text-gray-600 font-light font-beVietNamPro">
        {news.content[0]}
      </p>
    </a>
  );
}
