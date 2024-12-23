import { useState, useContext } from "react";
import SideBar from "./SideBar";
import { SidebarContext } from "./SideBarContext";
import MedicineForm from "./MedicineForm";
import MedicineList from "./MedicineList";

function MedicinesPharmacy() {
  const { isSideBarOpen } = useContext(SidebarContext);
  const [medicines, setMedicines] = useState([]);

  const addMedicine = (medicine) => {
    setMedicines([...medicines, medicine]);
  };

  const updateMedicine = (updatedMedicine) => {
    setMedicines(
      medicines.map((med) =>
        med.id === updatedMedicine.id ? updatedMedicine : med
      )
    );
  };

  const deleteMedicine = (id) => {
    setMedicines(medicines.filter((med) => med.id !== id));
  };

  return (
    <div className={`main-container ${isSideBarOpen ? 'sidebar-open' : ''}`}>
      <SideBar />
      <div className="content">
        <MedicineForm addMedicine={addMedicine} />
        <MedicineList
          medicines={medicines}
          updateMedicine={updateMedicine}
          deleteMedicine={deleteMedicine}
        />
      </div>
    </div>
  );
}

export default MedicinesPharmacy;