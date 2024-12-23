import React, { useContext } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import SideBar from "./SideBar";
import { SidebarContext } from "./SideBarContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPharmacy = () => {
  const { isSideBarOpen } = useContext(SidebarContext);
  // Sample data for new charts
  const revenueGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Current Year',
        data: [30000, 35000, 45000, 55000, 59000, 65000],
        borderColor: 'rgb(72, 158, 92)',
        backgroundColor: 'rgb(18, 137, 46)',
        fill: false,
      },
      {
        label: 'Previous Year',
        data: [25000, 29000, 35000, 40000, 42000, 45000],
        borderColor: 'rgb(83, 215, 208)',
        backgroundColor: 'rgb(25, 162, 155)',
        fill: true,
      }
    ]
  };

  const hourlyOrdersData = {
    labels: ['Sam', 'Jones', 'Alex', 'Chris', 'John', 'Doe'],
    datasets: [{
      label: 'Top Customers',
      data: [15000, 30000, 45000, 55000, 40000, 25000],
      backgroundColor: [
        'rgba(0, 128, 128, 1)',
        'rgb(15, 95, 95)', 
        'rgb(0, 128, 128, 1)', 
        'rgb(15, 95, 95)',
        'rgba(0, 128, 128, 1)', 
      ],
      borderWidth: 1,
      borderRadius: 10,
    }]
  };

  const inventoryLevelsData = {
    labels: ['Critical', 'Low', 'Medium', 'Optimal'],
    datasets: [{
      data: [5, 15, 40, 40],
      backgroundColor: ['#2D6A4F',    // Bright red for Critical
        '#014d4e',  // Dark teal
        '#026c6d',  // Mid teal
        '#04a1a3',],
      borderWidth: 1,
      borderColor: '#ffffff',
      hoverBackgroundColor: [
        '#40916C', 
        '#015f60',  
        '#038485',  
        '#05b8ba',  
      ],
      hoverOffset: 4
    }]
  };

  return (
    <div className={`main-container ${isSideBarOpen ? 'sidebar-open' : ''}`}>
      <SideBar />
      <div className="content">
        <div className="dashboard-charts-container">  
          <div className="chart-card">
            <h3>Revenue Growth Comparison</h3>
            <Line 
              data={revenueGrowthData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value/1000}k`
                    }
                  }
                }
              }}
            />
          </div>


          <div className="chart-card">
            <h3>Top Customers</h3>
            <Bar 
              data={hourlyOrdersData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>

          {/* Inventory Levels */}
          <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '400px' }}>
            <h3>Inventory Levels Distribution</h3>
            <div style={{ width: '80%', height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Doughnut 
              data={inventoryLevelsData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { position: 'bottom',
                    align: 'center',
                   }
                },
                cutout: '65%'
              }}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPharmacy;