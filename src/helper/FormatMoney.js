export default function formatMoney(number) {
  let str = number.toString();

  const parts = str.split(".");
  let integerPart = parts[0];

  let formatted = "";
  for (let i = integerPart.length - 1, count = 0; i >= 0; i--) {
    formatted = integerPart[i] + formatted;
    count++;
    if (count % 3 === 0 && i > 0) {
      formatted = "." + formatted;
    }
  }

  return parts.length > 1 ? `${formatted},${parts[1]}` : formatted;
}
