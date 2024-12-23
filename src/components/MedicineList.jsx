import styles from '../App.css';

function MedicineList({ medicines, updateMedicine, deleteMedicine }) {
  return (
    <div>
      {medicines.map((med) => (
        <div key={med.id} className={styles.medicineCard}>
          <h3 className={styles.medicineName}>{med.name}</h3>
          <p className={styles.medicineDescription}>{med.description}</p>
          <p>Price: ${med.price}</p>
          <p>Quantity: {med.quantity}</p>
          <div className={styles.actionButtons}>
            <button onClick={() => updateMedicine(med)} className={styles.editButton}>Edit</button>
            <button onClick={() => deleteMedicine(med.id)} className={styles.deleteButton}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MedicineList;