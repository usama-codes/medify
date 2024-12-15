import React, { useState, useEffect, useContext } from "react";
import Card from "./Card";
import SearchBar from "./SearchBar";
import SideBar from "./SideBar";
import { SidebarContext } from "./SideBarContext";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import BarChart from "./BarChart";
import { faTimesCircle, faTruck, faDollarSign, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// Registering necessary chart elements
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const OrderPharmacy = () => {
  const { isSideBarOpen } = useContext(SidebarContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pending: 0,
    shipped: 0,
    canceled: 0,
    totalRevenue: 0,
    topSellingProducts: [],
    frequentCustomers: [],
  });
  const [searchResults, setSearchResults] = useState(false); // State to track if search results are displayed

  useEffect(() => {
    const fetchOrders = () => {
      const fetchedOrders = [
        { id: 1, status: "Pending", productName: "Aspirin", customerName: "John Doe", date: "2024-12-10", revenue: 15.99 },
        { id: 2, status: "Shipped", productName: "Tylenol", customerName: "Jane Smith", date: "2024-12-08", revenue: 12.49 },
        { id: 3, status: "Canceled", productName: "Advil", customerName: "Alice Brown", date: "2024-12-05", revenue: 8.99 },
        { id: 4, status: "Pending", productName: "Ibuprofen", customerName: "Bob White", date: "2024-12-06", revenue: 9.99 },
        { id: 5, status: "Shipped", productName: "Aspirin", customerName: "Charlie Black", date: "2024-12-07", revenue: 16.49 },
      ];

      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);

      const stats = fetchedOrders.reduce(
        (acc, order) => {
          acc.totalOrders++;
          acc.totalRevenue += order.revenue;
          if (order.status === "Pending") acc.pending++;
          if (order.status === "Shipped") acc.shipped++;
          if (order.status === "Canceled") acc.canceled++;

          acc.topSellingProducts[order.productName] = (acc.topSellingProducts[order.productName] || 0) + 1;
          acc.frequentCustomers[order.customerName] = (acc.frequentCustomers[order.customerName] || 0) + 1;

          return acc;
        },
        {
          totalOrders: 0,
          pending: 0,
          shipped: 0,
          canceled: 0,
          totalRevenue: 0,
          topSellingProducts: {},
          frequentCustomers: {},
        }
      );

      stats.topSellingProducts = Object.entries(stats.topSellingProducts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Get top 5 products

      stats.frequentCustomers = Object.entries(stats.frequentCustomers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3); // Get top 3 customers

      setOrderStats(stats);
    };

    fetchOrders();
  }, []);

  const handleSearch = (term) => {
    console.log("Search term:", term); // Log the search term
    if (term.trim() === "") {
      setFilteredOrders([]); // If search term is empty, reset results
      setSearchResults(false); // No search results found
      return;
    }

    const filtered = orders.filter(
      (order) =>
        order.productName.toLowerCase().includes(term.toLowerCase()) ||
        order.customerName.toLowerCase().includes(term.toLowerCase()) ||
        order.id.toString().includes(term)
    );

    console.log("Filtered orders:", filtered); // Log the filtered orders

    setFilteredOrders(filtered); // Set filtered orders based on search term
    setSearchResults(filtered.length > 0); // If there are results, show them
  };

  // Handle back button click
  const handleBackButtonClick = () => {
    setSearchResults(false); // Reset search results
    setFilteredOrders([]); // Clear filtered orders
  };

  // Pie chart data
  const pieChartData = {
    labels: ["Pending", "Shipped", "Canceled"],
    datasets: [
      {
        data: [orderStats.pending, orderStats.shipped, orderStats.canceled],
        backgroundColor: ["#FF6A6A", "#4CAF50", "#FF9800"],
        borderColor: ["#FF6A6A", "#4CAF50", "#FF9800"],
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className={`order-pharmacy ${isSideBarOpen ? "sidebar-open" : ""}`}>
      <div className="sideBar">
        <SideBar
         />
        </div>
      <div className="main-content">
        <div className="header">
          <SearchBar
            onSearch={handleSearch}
            searchResults={searchResults} // Pass searchResults state to SearchBar
            onBack={handleBackButtonClick} // Pass back button handler to SearchBar
          />
        </div>

        {searchResults ? (
          <div className="order-list">
            {filteredOrders.map((order) => {
              // Determine colors based on order status
              let backgroundColor;
              let textColor;

              if (order.status === "Shipped") {
                backgroundColor = "#deffeb"; // Light green background
                textColor = "#1cc656";       // Dark green text
              } else if (order.status === "Pending") {
                backgroundColor = "#FFFDE7"; // Light yellow background
                textColor = "#ff9800";       // Dark yellow text
              } else if (order.status === "Canceled") {
                backgroundColor = "#ffebee"; // Light red background
                textColor = "#d8442f";       // Dark red text
              } else {
                backgroundColor = "#FFFFFF"; // Default background
                textColor = "#000000";       // Default text color
              }

              return (
                <Card
                  key={order.id}
                  title={order.productName}
                  content={
                    <div>
                      <p>Customer: <strong>{order.customerName}</strong></p>
                      <p>Status: <strong>{order.status}</strong></p>
                      <p>Order Date: <strong>{order.date}</strong></p>
                    </div>
                  }
                  icon={faShoppingCart}
                  color={backgroundColor}
                  textColor={textColor}
                  iconColor={textColor}
                  shadow
                  className="search-result-card"
                />
              );
            })}
          </div>
        ) : (
          <>
            {/* Only display these components if no search results */}
            <div className="order-stats">
              <Card
                title="Orders This Month"
                content={orderStats.totalOrders}
                icon={faShoppingCart}
                color="#E0F7FA"
                textColor="#00796B"
                iconColor="#00796B"
              />
              <Card
                title="Total Revenue"
                content={`$${orderStats.totalRevenue.toFixed(2)}`}
                icon={faDollarSign}
                color="#FFEBEE"
                textColor="#D32F2F"
                iconColor="#D32F2F"
              />
              <Card
                title="Shipped Orders"
                content={orderStats.shipped}
                icon={faTruck}
                color="#E8F5E9"
                textColor="#388E3C"
                iconColor="#388E3C"
              />
              <Card
                title="Canceled Orders"
                content={orderStats.canceled}
                icon={faTimesCircle}
                color="#FFEBEE"
                textColor="#D32F2F"
                iconColor="#D32F2F"
              />
            </div>

            <div className="charts-container" style={{ display: "flex", justifyContent: "space-between", gap: "2rem", marginTop: "2rem" }}>
              <div className="pie-chart" style={{ flex: 1 }}>
                <h3>Order Status</h3>
                <div className="pieChart" style={{ width: "100%", height: "400px", justifyItems: "center" }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
              <div className="bar-chart" style={{ flex: 1 }}>
                <h3>Top Products</h3>
                <BarChart />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPharmacy;