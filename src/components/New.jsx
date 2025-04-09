import timestampToDate from "../helper/TimestampToDate";

export default function New({ singleNew }) {
  return (
    <div className="border p-5 rounded-lg border-gray-300 sm:border-none sm:p-0">
      <a href={`/new/${singleNew.id}`}>
        <img
          src={singleNew.cover}
          alt={singleNew.title}
          className="hover:opacity-70 mb-5 aspect-video object-cover"
        />
      </a>
      <span className="italic sm:text-xs md:text-sm text-gray-500">
        {timestampToDate(singleNew.created_at)}
      </span>
      <a href={`/new/${singleNew.id}`}>
        <h3 className="text-main font-bold my-2 hover:text-hover sm:text-sm">
          {singleNew.title}
        </h3>
      </a>
      <p className="text-gray-500 text-sm/5 mb-2 sm:text-xs md:text-sm">
        {singleNew.content[0]}
      </p>
      <a
        href={`/new/${singleNew.id}`}
        className="text-main hover:text-hover italic text-xs "
      >
        Đọc tiếp
      </a>
    </div>
  );
}
