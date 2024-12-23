import React, { useState, useEffect, useContext } from "react";
import "../App.css";
import SideBar from "./SideBar";
import Card from "./Card";
import { SidebarContext } from "./SideBarContext";
import {
  faShoppingCart,
  faDollarSign,
  faTruck,
  faTimesCircle,
  faPencilAlt,
  faTrashAlt,
  faFilter,
  faArrowLeft,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBar from "./SearchBar";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import BarChart from "./BarChart";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const OrderPharmacy = () => {
  const { isSideBarOpen } = useContext(SidebarContext);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedOrder, setEditedOrder] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pending: 0,
    shipped: 0,
    canceled: 0,
    totalRevenue: 0,
  });

  const showAllOrders = () => {
  setFilterType('all');
  setSearchTerm('');
  setFilteredOrders(orders);
  setSearchResults(true);
  };

  const handleSearch = (term) => {
    if (term.trim() === "") {
      setFilteredOrders([]);
      setSearchResults(false);
      setNoResults(false);
      return;
    }

    let filtered;
    switch (filterType) {
    case 'orderId':
      filtered = orders.filter(order => 
        order.id.toString() === term.trim()
      );
      break;
    case 'productName':
      filtered = orders.filter(order => 
        order.productName.toLowerCase().includes(term.toLowerCase())
      );
      break;
    case 'customerName':
      filtered = orders.filter(order => 
        order.customerName.toLowerCase().includes(term.toLowerCase())
      );
      break;
    case 'status':
      filtered = orders.filter(order => 
        order.status.toLowerCase().includes(term.toLowerCase())
      );
      break;
    case 'all':
      default:
      filtered = orders.filter(order => 
        order.id.toString().includes(term) ||
        order.productName.toLowerCase().includes(term.toLowerCase()) ||
        order.customerName.toLowerCase().includes(term.toLowerCase()) ||
        order.status.toLowerCase().includes(term.toLowerCase())
      );
    }

  setFilteredOrders(filtered);
  setSearchResults(true);
  setNoResults(filtered.length === 0);
};

  const handleBack = () => {
    setSearchTerm('');
    setFilteredOrders(orders);
    setSearchResults(false);
  };  

  const handleCheckboxChange = (orderId) => {
    setSelectedRows(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (event) => {
    setSelectedRows(
      event.target.checked ? orders.map(order => order.id) : []
    );
  };

  const handleEdit = (orderId) => {
  const orderToEdit = orders.find(order => order.id === orderId);
  setEditingId(orderId);
  setEditedOrder({...orderToEdit});
};

  const handleSave = () => {
    const updatedOrders = orders.map(order => 
      order.id === editingId ? editedOrder : order
    );
    setOrders(updatedOrders);
    
    // Update filtered orders if search is active
    if (searchResults) {
      setFilteredOrders(updatedOrders.filter(order => 
        filteredOrders.some(fo => fo.id === order.id)
      ));
    }

    // Recalculate order stats
    const newStats = updatedOrders.reduce(
      (acc, order) => {
        acc.totalOrders++;
        acc.totalRevenue += parseFloat(order.revenue);
        if (order.status === "Pending") acc.pending++;
        if (order.status === "Shipped") acc.shipped++;
        if (order.status === "Canceled") acc.canceled++;
        return acc;
      },
      {
        totalOrders: 0,
        pending: 0,
        shipped: 0,
        canceled: 0,
        totalRevenue: 0,
      }
    );
    
    setOrderStats(newStats);
    setEditingId(null);
    setEditedOrder(null);
  };

  const handleDelete = (orderId) => {
    // Confirm before deletion
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    // Remove from orders
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);

    // Update filtered orders if search is active
    if (searchResults) {
      setFilteredOrders(filteredOrders.filter(order => order.id !== orderId));
    }

  // Recalculate order stats
  const newStats = updatedOrders.reduce(
    (acc, order) => {
      acc.totalOrders++;
      acc.totalRevenue += parseFloat(order.revenue);
      if (order.status === "Pending") acc.pending++;
      if (order.status === "Shipped") acc.shipped++;
      if (order.status === "Canceled") acc.canceled++;
      return acc;
    },
    {
      totalOrders: 0,
      pending: 0,
      shipped: 0,
      canceled: 0,
      totalRevenue: 0,
    }
  );
  
  setOrderStats(newStats);
  
  // Clear selection if deleted order was selected
  setSelectedRows(prev => prev.filter(id => id !== orderId));
};

  const handleCancel = () => {
    setEditingId(null);
    setEditedOrder(null);
  };

  const handleInputChange = (e, field) => {
    setEditedOrder({
      ...editedOrder,
      [field]: e.target.value
    });
  };

  const getPlaceholderText = () => {
    switch (filterType) {
      case 'orderId':
        return 'Order ID...';
      case 'productName':
        return 'Product Name...';
      case 'customerName':
        return 'Customer Name...';
      case 'status':
        return 'Status...';
      default:
        return 'Search...';
    }
  };

  useEffect(() => {
    const fetchOrders = () => {
      const fetchedOrders = [
        {
          id: 1,
          status: "Pending",
          productName: "Aspirin",
          customerName: "John Doe",
          date: "2024-12-10",
          revenue: 15.99,
        },
        {
          id: 2,
          status: "Shipped",
          productName: "Tylenol",
          customerName: "Jane Smith",
          date: "2024-12-08",
          revenue: 12.49,
        },
        {
          id: 3,
          status: "Canceled",
          productName: "Advil",
          customerName: "Alice Brown",
          date: "2024-12-05",
          revenue: 8.99,
        },
        {
          id: 4,
          status: "Pending",
          productName: "Ibuprofen",
          customerName: "Bob White",
          date: "2024-12-06",
          revenue: 9.99,
        },
        {
          id: 5,
          status: "Shipped",
          productName: "Aspirin",
          customerName: "Charlie Black",
          date: "2024-12-07",
          revenue: 16.49,
        },
      ];

      setOrders(fetchedOrders);

      const stats = fetchedOrders.reduce(
        (acc, order) => {
          acc.totalOrders++;
          acc.totalRevenue += order.revenue;
          if (order.status === "Pending") acc.pending++;
          if (order.status === "Shipped") acc.shipped++;
          if (order.status === "Canceled") acc.canceled++;
          return acc;
        },
        {
          totalOrders: 0,
          pending: 0,
          shipped: 0,
          canceled: 0,
          totalRevenue: 0,
        }
      );
      setOrderStats(stats);
    };

    fetchOrders();
  }, []);

  const pieChartData = {
    labels: ["Pending", "Shipped", "Canceled"],
    datasets: [
      {
        data: [orderStats.pending, orderStats.shipped, orderStats.canceled],
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
    interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
          },
    hover: {
            onHover: function (e) {
              const point = this.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
              e.native.target.style.cursor = point.length ? 'pointer' : 'default';
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
            onBack={handleBack}
            placeholder={getPlaceholderText()}
            icon={searchResults ? faArrowLeft : faSearch  }
          />
          <button
            className={`filter-button ${isFilterOpen ? 'active' : ''}`}
            onClick={toggleFilter}
          >
            <FontAwesomeIcon icon={faFilter} size="lg"/>
          </button>
          {isFilterOpen && (
            <div className="filter-dropdown">
              <div 
                className={`filter-option ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('all');
                  showAllOrders();
                  toggleFilter();
                }}
              >
                All Orders
              </div>
              <div 
                className={`filter-option ${filterType === 'orderId' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('orderId');
                  toggleFilter();
                }}
              >
                Order ID
              </div>
              <div 
                className={`filter-option ${filterType === 'productName' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('productName');
                  toggleFilter();
                }}
              >
                Product Name
              </div>
              <div 
                className={`filter-option ${filterType === 'customerName' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('customerName');
                  toggleFilter();
                }}
              >
                Customer Name
              </div>
              <div 
                className={`filter-option ${filterType === 'status' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('status');
                  toggleFilter();
                }}
              >
                Status
              </div>
            </div>
          )}
        </div>
      </div>
      {searchResults ? (
        noResults ? (
          <div className="no-results"><h2>No results found</h2></div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      className="order-checkbox"
                      checked={selectedRows.length === filteredOrders.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Order ID</th>
                  <th>Product Name</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Cost</th>
                  <th className="action-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      className="order-checkbox"
                      checked={selectedRows.includes(order.id)}
                      onChange={() => handleCheckboxChange(order.id)}
                    />
                  </td>
                  <td>{order.id}</td>
                  <td>
                    {editingId === order.id ? (
                      <input
                        value={editedOrder.productName}
                        onChange={(e) => handleInputChange(e, 'productName')}
                      />
                    ) : (
                      order.productName
                    )}
                    </td>
                    <td>
                      {editingId === order.id ? (
                        <input
                          value={editedOrder.customerName}
                          onChange={(e) => handleInputChange(e, 'customerName')}
                        />
                      ) : (
                        order.customerName
                      )}
                    </td>
                    <td>
                      {editingId === order.id ? (
                        <input
                          type="date"
                          value={editedOrder.date}
                          onChange={(e) => handleInputChange(e, 'date')}
                        />
                      ) : (
                        order.date
                      )}
                    </td>
                        <td>
                      {editingId === order.id ? (
                        <select
                          value={editedOrder.status}
                          onChange={(e) => handleInputChange(e, 'status')}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Canceled">Canceled</option>
                        </select>
                      ) : (
                        order.status
                      )}
                    </td>
                    <td>
                      {editingId === order.id ? (
                        <input
                          type="number"
                          value={editedOrder.revenue}
                          onChange={(e) => handleInputChange(e, 'revenue')}
                          step="0.01"
                        />
                      ) : (
                        `$${order.revenue.toFixed(2)}`
                      )}
                    </td>
                    <td className="action-cell">
                      <div className="action-icons">
                        {editingId === order.id ? (
                          <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={faPencilAlt}
                              className="action-icon edit-icon"
                              onClick={() => handleEdit(order.id)}
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className="action-icon delete-icon"
                              onClick={() => handleDelete(order.id)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <>
          <div className="card-container">
            <Card
              title="Total Orders"
              content={orderStats.totalOrders}
              icon={faShoppingCart}
              color="#014d4e"
            />
            <Card
              title="Shipped Orders"
              content={orderStats.shipped}
              icon={faTruck}
              color="#fff"
              textColor="#014d4e"
              iconColor="#014d4e"
            />
            <Card
              title="Canceled Orders"
              content={orderStats.canceled}
              icon={faTimesCircle}
              color="#014d4e"
            />
            <Card
              title="Pending Orders"
              content={orderStats.pending}
              icon={faTimesCircle}
              color="#fff"
              textColor="#014d4e"
              iconColor="#014d4e"
            />
            <Card
              title="Total Revenue"
              content={`$${orderStats.totalRevenue.toFixed(2)}`}
              icon={faDollarSign}
              color="#014d4e"
            />
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
                <BarChart />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default OrderPharmacy;