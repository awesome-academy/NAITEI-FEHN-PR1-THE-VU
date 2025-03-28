import { Select } from "@headlessui/react";
import Chart from "../components/Chart";
import { useEffect, useState } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  subWeeks,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  eachYearOfInterval,
  parseISO,
  isWithinInterval,
  getWeek,
  getYear,
} from "date-fns";
import formatMoney from "../helper/FormatMoney";
import SectionHeading from "../components/SectionHeading";
import {
  BanknotesIcon,
  PhotoIcon,
  RectangleStackIcon,
  TagIcon,
} from "@heroicons/react/24/solid";

export default function Statistics() {
  const [timeframe, setTimeframe] = useState("daily");
  const [orders, setOrders] = useState([]);
  const [generalStatistic, setGeneralStatistic] = useState({});
  const [dataSets, setDataSets] = useState({
    daily: { labels: [], income: [], orders: [] },
    weekly: { labels: [], income: [], orders: [] },
    monthly: { labels: [], income: [], orders: [] },
    yearly: { labels: [], income: [], orders: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orders, trees, categories] = await Promise.all([
          fetch("http://localhost:5000/orders").then((res) => res.json()),
          fetch("http://localhost:5000/trees").then((res) => res.json()),
          fetch("http://localhost:5000/categories").then((res) => res.json()),
        ]);

        const totalIncome = orders.reduce((sum, order) => sum + order.total, 0);
        setGeneralStatistic({
          categories: categories.length,
          plants: trees.length,
          orders: orders.length,
          totalIncome: totalIncome,
        });
        setOrders(orders);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    const currentDate = parseISO(new Date().toISOString());

    // --- Daily: Each weekday of the current week ---
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({
      start: startOfCurrentWeek,
      end: endOfCurrentWeek,
    });

    const dailyStats = daysOfWeek.map((day) => {
      const ordersOnDay = orders.filter((order) => {
        const orderDate = parseISO(order.created_at);
        return format(orderDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      });

      const incomeOnDay = ordersOnDay.reduce(
        (sum, order) => sum + order.total,
        0,
      );

      return {
        day: format(day, "EEE"),
        date: format(day, "yyyy-MM-dd"),
        orders: ordersOnDay.length,
        income: incomeOnDay,
      };
    });

    const dailyDataSet = {
      labels: dailyStats.map((stat) => stat.day),
      income: dailyStats.map((stat) => stat.income),
      orders: dailyStats.map((stat) => stat.orders),
    };

    // --- Weekly: Last 4 weeks from the current week ---
    const currentWeekNumber = getWeek(currentDate, { weekStartsOn: 1 });
    const weeklyStats = Array.from({ length: 4 }, (_, index) => {
      const weekNumber = currentWeekNumber - index;
      const weekStart = startOfWeek(subWeeks(currentDate, index), {
        weekStartsOn: 1,
      });
      const weekEnd = endOfWeek(subWeeks(currentDate, index), {
        weekStartsOn: 1,
      });

      const ordersInWeek = orders.filter((order) => {
        const orderDate = parseISO(order.created_at);
        return isWithinInterval(orderDate, { start: weekStart, end: weekEnd });
      });

      const incomeInWeek = ordersInWeek.reduce(
        (sum, order) => sum + order.total,
        0,
      );

      // Format the week label as "startDay-endDay/month" (e.g., "23-29/4")
      const startDay = format(weekStart, "d"); // Day of month for start of week
      const endDay = format(weekEnd, "d"); // Day of month for end of week
      const month = format(weekStart, "M"); // Month (1-12)

      return {
        week: `${startDay}-${endDay}/${month}`, // e.g., "23-29/4"
        startDate: format(weekStart, "yyyy-MM-dd"),
        endDate: format(weekEnd, "yyyy-MM-dd"),
        orders: ordersInWeek.length,
        income: incomeInWeek,
      };
    }).reverse();

    const weeklyDataSet = {
      labels: weeklyStats.map((stat) => stat.week),
      income: weeklyStats.map((stat) => stat.income),
      orders: weeklyStats.map((stat) => stat.orders),
    };

    // --- Monthly: All months of the current year (2025) ---
    const startOfCurrentYear = startOfYear(currentDate);
    const endOfCurrentYear = endOfYear(currentDate);
    const monthsOfYear = eachMonthOfInterval({
      start: startOfCurrentYear,
      end: endOfCurrentYear,
    });

    const monthlyStats = monthsOfYear.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const ordersInMonth = orders.filter((order) => {
        const orderDate = parseISO(order.created_at);
        return isWithinInterval(orderDate, {
          start: monthStart,
          end: monthEnd,
        });
      });

      const incomeInMonth = ordersInMonth.reduce(
        (sum, order) => sum + order.total,
        0,
      );

      return {
        month: format(month, "MMM"),
        fullMonth: format(month, "yyyy-MM"),
        orders: ordersInMonth.length,
        income: incomeInMonth,
      };
    });

    const monthlyDataSet = {
      labels: monthlyStats.map((stat) => stat.month),
      income: monthlyStats.map((stat) => stat.income),
      orders: monthlyStats.map((stat) => stat.orders),
    };

    // --- Yearly: From the oldest order ---
    const oldestOrderDate = parseISO(
      orders.reduce((earliest, order) => {
        const orderDate = parseISO(order.created_at);
        return orderDate < parseISO(earliest) ? order.created_at : earliest;
      }, orders[0].created_at),
    );

    const years = eachYearOfInterval({
      start: startOfYear(oldestOrderDate),
      end: endOfYear(currentDate),
    });

    const yearlyStats = years.map((year) => {
      const yearStart = startOfYear(year);
      const yearEnd = endOfYear(year);

      const ordersInYear = orders.filter((order) => {
        const orderDate = parseISO(order.created_at);
        return isWithinInterval(orderDate, { start: yearStart, end: yearEnd });
      });

      const incomeInYear = ordersInYear.reduce(
        (sum, order) => sum + order.total,
        0,
      );

      return {
        year: getYear(year),
        orders: ordersInYear.length,
        income: incomeInYear,
      };
    });

    const yearlyDataSet = {
      labels: yearlyStats.map((stat) => stat.year.toString()),
      income: yearlyStats.map((stat) => stat.income),
      orders: yearlyStats.map((stat) => stat.orders),
    };

    // Update dataSets state
    setDataSets({
      daily: dailyDataSet,
      weekly: weeklyDataSet,
      monthly: monthlyDataSet,
      yearly: yearlyDataSet,
    });
  }, [orders]);

  const incomeChartData = {
    labels: dataSets[timeframe].labels,
    datasets: [
      {
        label: "Doanh thu",
        data: dataSets[timeframe].income,
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const orderChartData = {
    labels: dataSets[timeframe].labels,
    datasets: [
      {
        label: "Đơn hàng",
        data: dataSets[timeframe].orders,
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="relative">
        <SectionHeading heading="Thống kê" />
        <Select
          name="Lọc"
          aria-label="Project status"
          className="absolute top-[-40px] right-0 p-2 py-1 border border-gray-500 rounded data-[hover]:shadow"
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="daily">Theo ngày</option>
          <option value="weekly">Theo tuần</option>
          <option value="monthly">Theo tháng</option>
          <option value="yearly">Theo năm</option>
        </Select>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
        <li className="col-span-1 border border-gray-200 flex flex-col items-start rounded-lg p-2 text-lg text-gray-600 bg-white ">
          <span className="p-2 bg-gray-200 rounded-lg my-2">
            <TagIcon className="size-3" />
          </span>
          <span className="text-xs mt-2 mb-1">Số loại cây</span>
          <span className="text-base font-bold">
            {generalStatistic.categories}
          </span>
        </li>
        <li className="col-span-1 border border-gray-200 flex flex-col items-start rounded-lg p-2 text-lg text-gray-600 bg-white ">
          <span className="p-2 bg-gray-200 rounded-lg my-2">
            <PhotoIcon className="size-3" />
          </span>
          <span className="text-xs mt-2 mb-1">Số cây trong kho</span>
          <span className="text-base font-bold">{generalStatistic.plants}</span>
        </li>
        <li className="col-span-1 border border-gray-200 flex flex-col items-start rounded-lg p-2 text-lg text-gray-600 bg-white ">
          <span className="p-2 bg-gray-200 rounded-lg my-2">
            <RectangleStackIcon className="size-3" />
          </span>
          <span className="text-xs mt-2 mb-1">Số đơn hàng</span>
          <span className="text-base font-bold">{generalStatistic.orders}</span>
        </li>
        <li className="col-span-1 border border-gray-200 flex flex-col items-start rounded-lg p-2 text-lg text-gray-600 bg-white ">
          <span className="p-2 bg-gray-200 rounded-lg my-2">
            <BanknotesIcon className="size-3" />
          </span>
          <span className="text-xs mt-2 mb-1">Tổng doanh thu</span>
          <span className="text-base font-bold">
            {formatMoney(generalStatistic.totalIncome)} đ
          </span>
        </li>
      </ul>

      <div className="w-full max-w-5xl mx-auto py-6 bg-white rounded-lg flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex-1 w-full sm:max-w-[50%]">
          <Chart
            chartData={incomeChartData}
            chartTitle="Biểu đồ doanh thu"
            yScaleTitle="Đồng"
          />
        </div>
        <div className="flex-1 w-full sm:max-w-[50%]">
          <Chart
            chartData={orderChartData}
            chartTitle="Biểu đồ đơn hàng"
            yScaleTitle="Đơn"
          />
        </div>
      </div>
    </>
  );
}
