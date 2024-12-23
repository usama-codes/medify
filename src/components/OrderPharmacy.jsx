import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../App.css";
import SideBar from "./SideBar";
import Card from "./Card";
import { SidebarContext } from "./SideBarContext";
import {
  faShoppingCart,
  faDollarSign,
  faTruck,
  faTimesCircle,
  faFilter,
  faSearch,
  faArrowLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./SearchBar";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import BarChart from "./BarChart";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderPharmacy = () => {
  const { isSideBarOpen } = useContext(SidebarContext);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pending: 0,
    shipped: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  });
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const getPlaceholderText = () => {
    switch (filterType) {
      case "orderId":
        return "Order ID...";
      case "productName":
        return "Product Name...";
      case "customerName":
        return "Customer Name...";
      case "status":
        return "Status...";
      default:
        return "Search...";
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setHasSearched(true);

    if (term.trim() === "") {
      setFilteredOrders([]);
      setSearchResults(false);
      setNoResults(false);
      return;
    }

    const filtered = orders.filter((order) => {
      switch (filterType) {
        case "orderId":
          return order.order_id.toString().includes(term.trim());
        case "productName":
          return order.medicine_name.toLowerCase().includes(term.toLowerCase());
        case "customerName":
          return order.customer_name.toLowerCase().includes(term.toLowerCase());
        case "status":
          return order.status.toLowerCase().includes(term.toLowerCase());
        default:
          return (
            order.order_id.toString().includes(term.trim()) ||
            order.medicine_name.toLowerCase().includes(term.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(term.toLowerCase()) ||
            order.status.toLowerCase().includes(term.toLowerCase())
          );
      }
    });

    setFilteredOrders(filtered);
    setSearchResults(true);
    setNoResults(filtered.length === 0);
  };
  const handleEdit = async (id, field, value) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
  
      // Update the order in the backend
      await axios.put(
        `http://localhost:4000/api/pharmacy/order/${id}`, 
        { [field]: value }, 
        { headers }
      );
  
      // Update the local state after the API call succeeds
      setFilteredOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === id ? { ...order, [field]: value } : order
        )
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === id ? { ...order, [field]: value } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      setError("Failed to update the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const headers = { Authorization: `Bearer ${token}` };
  
      // Send a DELETE request to the API
      await axios.delete(`http://localhost:4000/api/pharmacy/order/${id}`, { headers });
  
      // Update the local state to remove the deleted order
      setFilteredOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== id)
      );
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== id)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const headers = { Authorization: `Bearer ${token}` };

    const fetchOrdersData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          totalOrdersRes,
          shippedOrdersRes,
          pendingOrdersRes,
          cancelledOrdersRes,
          completedOrdersRes,
          ordersRes,
          topSellingRes,
        ] = await Promise.all([
          axios.get("http://localhost:4000/api/pharmacy/total-orders", { headers }),
          axios.get("http://localhost:4000/api/pharmacy/shipped-count", { headers }),
          axios.get("http://localhost:4000/api/pharmacy/pending-count", { headers }),
          axios.get("http://localhost:4000/api/pharmacy/cancelled-orders", { headers }),
          axios.get("http://localhost:4000/api/pharmacy/complete-orders", { headers }),
          axios.get("http://localhost:4000/api/pharmacy/allorder", { headers }),
          axios.get("http://localhost:4000/api/pharmacy/top-selling-products", { headers }),
        ]);

        setOrderStats({
          totalOrders: totalOrdersRes.data.totalOrdersCount || 0,
          pending: pendingOrdersRes.data.pendingOrderCount || 0,
          shipped: shippedOrdersRes.data.shippedOrdersCount || 0,
          cancelled: cancelledOrdersRes.data.cancelledOrdersCount || 0,
          completed: completedOrdersRes.data.completedOrdersCount || 0,
        });

        setOrders(ordersRes.data.data || []);
        setTopSellingProducts(
          topSellingRes.data.topProduct.map((product) => ({
            name: product.product_name,
            sales: product.total_sales,
          })) || []
        );
      } catch (error) {
        console.error("Error fetching orders data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  const pieChartData = {
    labels: ["Pending", "Shipped", "Completed"],
    datasets: [
      {
        data: [orderStats.pending, orderStats.shipped, orderStats.completed],
        backgroundColor: ["#44a3a5", "#70c3c5", "#197274"],
        borderColor: ["#44a3a5", "#70c3c5", "#197274"],
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
    <div className={`main-container ${isSideBarOpen ? "sidebar-open" : ""}`}>
      <SideBar />
      <div className="content">
        <div className="search-bar-container">
          <div className="searchInputWrapper">
            <SearchBar
              searchTerm={searchTerm}
              searchResults={searchResults}
              onSearch={handleSearch}
              onBack={() => setSearchTerm("")}
              placeholder={getPlaceholderText()}
              icon={searchResults ? faArrowLeft : faSearch}
            />
            <button
              className={`filter-button ${isFilterOpen ? "active" : ""}`}
              onClick={toggleFilter}
            >
              <FontAwesomeIcon icon={faFilter} size="lg" />
            </button>
            {isFilterOpen && (
              <div className="filter-dropdown">
                <ul>
                  <li onClick={() => { setFilterType("orderId"); toggleFilter(); }}>Order ID</li>
                  <li onClick={() => { setFilterType("productName"); toggleFilter(); }}>Product Name</li>
                  <li onClick={() => { setFilterType("customerName"); toggleFilter(); }}>Customer Name</li>
                  <li onClick={() => { setFilterType("status"); toggleFilter(); }}>Status</li>
                  <li onClick={() => { setFilterType("all"); toggleFilter(); }}>All</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="card-container">
          <Card title="Total Orders" content={orderStats.totalOrders} icon={faShoppingCart} color="#014d4e" />
          <Card title="Shipped Orders" content={orderStats.shipped} icon={faTruck} color="#fff" textColor="#014d4e" iconColor="#014d4e" />
          <Card title="Pending Orders" content={orderStats.pending} icon={faTimesCircle} color="#fff" textColor="#014d4e" iconColor="#014d4e" />
          <Card title="Completed Orders" content={orderStats.completed} icon={faDollarSign} color="#014d4e" />
          <Card title="Cancelled Orders" content={orderStats.cancelled} icon={faTimesCircle} color="#fff" textColor="#014d4e" iconColor="#014d4e" />
        </div>
        <div className="charts-container">
          <div className="pie-chart">
            <h3>Order Status</h3>
            <div className="pieChart">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
          <div className="bar-chart">
            <h3>Top Products</h3>
            <div className="barChart">
              <BarChart products={topSellingProducts} />
            </div>
          </div>
        </div>
        <div className="order-table-container">
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {hasSearched && (
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product Name</th>
                  <th>Customer Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.order_id}</td>
                      <td>
                        <input
                          type="text"
                          value={order.medicine_name}
                          onChange={(e) =>
                            handleEdit(order.order_id, "medicine_name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={order.customer_name}
                          onChange={(e) =>
                            handleEdit(order.order_id, "customer_name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={order.status}
                          onChange={(e) =>
                            handleEdit(order.order_id, "status", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(order.order_id)}
                          className="delete-button"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPharmacy;
