import { useState, useContext, useEffect } from "react";
import SideBar from "./SideBar";
import { SidebarContext } from "./SideBarContext";
import MedicineForm from "./MedicineForm";
import axios from "axios";

function MedicinesPharmacy() {
  const { isSideBarOpen } = useContext(SidebarContext);
  const [medicines, setMedicines] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to control form visibility
  const [currentMedicine, setCurrentMedicine] = useState(null); // State for the medicine to edit

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/medicine/medicine");
      setMedicines(response.data.medicines);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      alert("Failed to load medicines.");
    }
  };

  const addMedicine = async (medicine) => {
    try {
      const response = await axios.post("http://localhost:4000/api/medicine/medicine", medicine);
      setMedicines([...medicines, response.data]);
      setIsFormOpen(false);
      alert("Medicine added successfully");
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert("Failed to add medicine.");
    }
  };

  const updateMedicine = async (updatedMedicine) => {
    try {
      await axios.put(`http://localhost:4000/api/medicine/${updatedMedicine.medicine_id}`, updatedMedicine);
      setMedicines(
        medicines.map((med) =>
          med.medicine_id === updatedMedicine.medicine_id ? updatedMedicine : med
        )
      );
      setIsFormOpen(false);
      alert("Medicine updated successfully");
    } catch (error) {
      console.error("Error updating medicine:", error);
      alert("Failed to update medicine.");
    }
  };

  const openEditForm = (medicine) => {
    setCurrentMedicine(medicine);
    setIsFormOpen(true);
  };

  return (
    <div className={`main-container ${isSideBarOpen ? "sidebar-open" : ""}`}>
      <SideBar />
      <div className="content">
        <button onClick={() => setIsFormOpen(true)} className="add-medicine-button">
          Add New Medicine
        </button>

        {isFormOpen && (
          <MedicineForm
            addMedicine={addMedicine}
            updateMedicine={updateMedicine}
            medicine={currentMedicine}
            closeForm={() => setIsFormOpen(false)}
          />
        )}

        <table className="medicine-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Formula</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.medicine_id}>
                <td>{medicine.name}</td>
                <td>{medicine.formula}</td>
                <td>{medicine.category}</td>
                <td>${medicine.price}</td>
                <td>{medicine.stock}</td>
                <td>
                  <button
                    onClick={() => openEditForm(medicine)} // Open form for editing
                    className="edit-button"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MedicinesPharmacy;
