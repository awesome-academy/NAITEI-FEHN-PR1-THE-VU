export default function timestampToDate(timestamp) {
  const formatted = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));

  return formatted;
}
