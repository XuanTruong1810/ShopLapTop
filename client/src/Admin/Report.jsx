import React, { useEffect, useState } from "react";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { LaptopOutlined } from "@mui/icons-material";
import axios from "axios";
import { Cascader, DatePicker } from "antd";
import { Doughnut, Line } from "react-chartjs-2";
import moment from "moment";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const { RangePicker } = DatePicker;
export default function Report() {
  const [report, setReport] = useState({});
  const [chartData, setChartData] = useState({
    labels: ["Facebook", "Google", "Tài khoản thông thường"],
    datasets: [
      {
        label: "Số lượng đăng nhập",
        data: [0, 0, 0],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
      },
    ],
  });
  const [ChartLine, setChartLine] = useState({
    labels: [],
    datasets: [
      {
        label: "Doanh thu bán hàng",
        data: [],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  const getReportToday = async () => {
    let response = await axios.get(
      "http://localhost:5076/api/Manager/GetHourlySalesStatistic"
    );

    if (response.data) {
      const hours = response.data.map((entry) => entry.Hour);
      const earnings = response.data.map((entry) => entry.Earnings);
      setChartLine({
        labels: hours,
        datasets: [
          {
            label: "Danh thu bán hàng",
            data: earnings,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });
    }
  };
  const getReportFourWeek = async () => {
    let response = await axios.get(
      "http://localhost:5076/api/Manager/GetRecentFourWeeksOrderStatistics"
    );

    if (response.data) {
      const WeekNumbers = response.data.map((entry) => entry.WeekNumber);
      const TotalAmounts = response.data.map((entry) => entry.TotalRevenue);
      setChartLine({
        labels: WeekNumbers,
        datasets: [
          {
            label: "Danh thu bán hàng",
            data: TotalAmounts,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });
    }
  };

  const getReportYear = async () => {
    let response = await axios.get(
      "http://localhost:5076/api/Manager/GetYearlyOrderStatistics",
      {
        params: {
          Year: 2023,
        },
      }
    );
    console.log(response.data);
    if (response.data) {
      const MonthYear = response.data.map((entry) =>
        moment(entry.MonthYear, "MMMM YYYY").format("[tháng] M")
      );
      const TotalAmount = response.data.map((entry) => entry.TotalAmount);
      setChartLine({
        labels: MonthYear,
        datasets: [
          {
            label: "Danh thu bán hàng",
            data: TotalAmount,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });
    }
  };
  const getReport = async () => {
    let response = await axios.get("http://localhost:5076/api/Manager/Report");

    if (response.data) {
      setReport(response.data);
    }
  };

  const fetchLoginData = async () => {
    try {
      const response = await axios(
        "http://localhost:5076/api/Manager/GetLoginStats"
      );

      setChartData((prevChartData) => ({
        ...prevChartData,
        datasets: [
          {
            ...prevChartData.datasets[0],
            data: [
              response.data.FacebookLoginsCount,
              response.data.GoogleLoginsCount,
              response.data.RegularUsersCount,
            ],
          },
        ],
      }));
    } catch (error) {
      console.error("Error fetching login data:", error);
    }
  };
  useEffect(() => {
    fetchLoginData();
    getReport();
  }, []);

  const options = [
    {
      label: "Thống kê doanh số ngày hiện tại",
      value: 1,
    },
    {
      label: "Thống kế doanh số năm hiện tại",
      value: 2,
    },
    {
      label: "Thống kê doanh số 4 tuần gần nhất",
      value: 3,
    },
  ];
  const onChange = (value) => {
    if (value[0] === 1) {
      getReportToday();
    }
    if (value[0] === 2) {
      getReportYear();
    }
    if (value[0] === 3) getReportFourWeek();
  };
  const handleDateChange = async (dates, dateStrings) => {
    let beginDay = dateStrings[0].split("-");
    let endDay = dateStrings[1].split("-");
    if (beginDay.length === 3 && endDay.length === 3) {
      let response = await axios.get(
        "http://localhost:5076/api/Manager/GetOrderStatistics",
        {
          params: {
            startYear: beginDay[0],
            startMonth: beginDay[1],
            startDay: beginDay[2],
            endYear: endDay[0],
            endMonth: endDay[1],
            endDay: endDay[2],
          },
        }
      );
      if (response.data) {
        const MonthYear = response.data.map((entry) =>
          moment(entry.MonthYear, "MMMM YYYY").format("[tháng] M")
        );
        const TotalAmount = response.data.map((entry) => entry.TotalSales);
        setChartLine({
          labels: MonthYear,
          datasets: [
            {
              label: "Danh thu bán hàng",
              data: TotalAmount,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        });
      }
    } else {
      setChartLine({
        labels: [],
        datasets: [
          {
            label: "Doanh thu bán hàng",
            data: [],
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      });
    }
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 300,
            height: 150,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 10,
            backgroundColor: "#ADD8E6",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: 150,
            }}
          >
            <div>
              <SupervisorAccountIcon style={{ fontSize: 40 }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <h5>Tài khoản</h5>
              <h5>{report.UserCount}</h5>
            </div>
          </div>
        </div>
        <div
          style={{
            width: 300,
            height: 150,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 10,
            backgroundColor: "#98FB98",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: 150,
            }}
          >
            <div>
              <LaptopOutlined style={{ fontSize: 40 }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <h5>Sản phẩm</h5>
              <h5>{report.ProductCount}</h5>
            </div>
          </div>
        </div>
        <div
          style={{
            width: 300,
            height: 150,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 10,
            backgroundColor: "#FFFFE0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: 150,
            }}
          >
            <div>
              <ShoppingCartOutlinedIcon style={{ fontSize: 40 }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <h5>Đã bán</h5>
              <h5>{report.SoldProductCount}</h5>
            </div>
          </div>
        </div>
        <div
          style={{
            width: 300,
            height: 150,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 10,
            backgroundColor: " #FFC0CB",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: 150,
            }}
          >
            <div>
              <AttachMoneyIcon style={{ fontSize: 40 }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <h5>Doanh thu</h5>
              <h5>
                {Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(report.TotalRevenue)}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 20,
            width: 500,
            height: 300,
            padding: "20px 10px",
          }}
        >
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              title: {
                display: true,
                text: "Biểu đồ đăng nhập",
                fontSize: 50,
              },
            }}
          />
        </div>

        <div
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: 20,
            width: 700,
            height: 300,
            padding: "20px 10px",
          }}
        >
          <Line data={ChartLine} style={{ width: "100%" }} />
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}
      >
        <RangePicker onChange={handleDateChange} />
        <Cascader
          options={options}
          onChange={onChange}
          placeholder="Please select"
        />
      </div>
    </div>
  );
}
