import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faPills } from '@fortawesome/free-solid-svg-icons';

function MedicineForm({ addMedicine, updateMedicine, medicine, closeForm }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        description: medicine.description || '',
        category: medicine.category || '',
        price: medicine.price || '',
        image: null, // Optionally update image if required
      });
      setImagePreview(medicine.image_url || null); // Set preview if the medicine has an image URL
    }
  }, [medicine]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Medicine name is required.';
    if (!formData.category) newErrors.category = 'Please select a category.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must not be empty or negative.';
    if (!formData.image && !medicine) newErrors.image = 'Please upload a photo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('image', formData.image);

        if (medicine) {
          // Editing an existing medicine
          await updateMedicine({ ...formData, medicine_id: medicine.medicine_id });
        } else {
          // Adding a new medicine
          await addMedicine(formDataToSend);
        }

        closeForm(); // Close the form after submission
      } catch (error) {
        console.error("Error submitting form:", error);
        alert('Error while saving the medicine.');
      }
    }
  };

  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <h1 className='form-header'>
        <FontAwesomeIcon icon={faPills} className='header-icon' />
        {medicine ? 'Edit Medicine' : 'Add New Medicine'}
      </h1>
      <div className="form-content">
        <div className="form-card">
          {/* Form Fields */}
          <div className="custom-form-group">
            <label htmlFor="nameInput" className="custom-label">Name:</label>
            <input
              type="text"
              id="nameInput"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`custom-input ${errors.name ? 'error-input' : ''}`}
            />
            {errors.name && <span className="error-text"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.name}</span>}
          </div>

          <div className="custom-form-group">
            <label htmlFor="descriptionInput" className="custom-label">Description:</label>
            <textarea
              id="descriptionInput"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`custom-input ${errors.description ? 'error-input' : ''}`}
              rows="5"
              style={{ overflowY: 'scroll', resize: 'none' }}
            />
            {errors.description && <span className="error-text"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.description}</span>}
          </div>

          <div className="custom-form-group">
            <label htmlFor="categoryInput" className="custom-label">Category:</label>
            <select
              id="categoryInput"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`custom-input ${errors.category ? 'error-input' : ''}`}
            >
              <option value="">Select a category</option>
              <option value="Anti-biotic">Anti-biotic</option>
              <option value="Anti-septics">Anti-septics</option>
              <option value="Anti-diabetic">Anti-diabetic</option>
              <option value="Pain Killer">Pain Killer</option>
              <option value="Homeopaethic">Homeopaethic</option>
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Sedatives">Sedatives</option>
              <option value="Laxatives">Laxatives</option>
              <option value="Vaccines">Vaccines</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <span className="error-text"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.category}</span>}
          </div>

          <div className="custom-form-group">
            <label htmlFor="priceInput" className="custom-label">Price:</label>
            <input
              type="number"
              id="priceInput"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`custom-input ${errors.price ? 'error-input' : ''}`}
            />
            {errors.price && <span className="error-text"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.price}</span>}
          </div>

          <div className="custom-form-group">
            <label htmlFor="photoInput" className="custom-label">Upload Photo:</label>
            <input
              type="file"
              id="photoInput"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="custom-input"
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="photo-preview" />}
            {errors.image && <span className="error-text"><FontAwesomeIcon icon={faExclamationCircle} /> {errors.image}</span>}
          </div>

          <div className="button-container">
            <button type="submit" className="custom-submit-button">
              <FontAwesomeIcon icon={faCheckCircle} /> {medicine ? 'Update Medicine' : 'Add Medicine'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default MedicineForm;
