import React, { useState } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faCheckCircle, 
  faExclamationCircle, 
  faPills,
} from '@fortawesome/free-solid-svg-icons';

function AddMedicineForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);

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
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleBulkFileChange = (event) => {
    const file = event.target.files[0];
    setBulkFile(file);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Medicine name is required.';
    if (!formData.category) newErrors.category = 'Please select a category.';
    if (!formData.description.trim()) newErrors.description = 'Description is required.';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must not be empty or negative.';
    if (!formData.photo) newErrors.photo = 'Please upload a photo.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Medicine added successfully!');
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        photo: null,
      });
      setPhotoPreview(null);
      setErrors({});
    }
  };

  const handleBulkImport = () => {
    if (bulkFile) {
      console.log('Bulk file uploaded:', bulkFile);
      alert('Bulk import in progress!');
      // Add your bulk processing logic here
    } else {
      alert('Please upload a file for bulk import.');
    }

  };


  return (
    <form className="custom-form" onSubmit={handleSubmit}>
      <h1 className='form-header'>
        <FontAwesomeIcon icon={faPills} className='header-icon' />
        Add New Medicine</h1>
      <div className="form-content">
        <div className="form-card">
          <div className="custom-form-group">
            <label htmlFor="nameInput" className="custom-label">
              Name:
            </label>
            <input
              type="text"
              id="nameInput"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`custom-input ${errors.name ? 'error-input' : ''}`}
            />
            {errors.name && (
              <span className="error-text">
                <FontAwesomeIcon icon={faExclamationCircle} /> {errors.name}
              </span>
            )}
          </div>

          <div className="custom-form-group">
            <label htmlFor="descriptionInput" className="custom-label">
              Description:
            </label>
            <textarea
              id="descriptionInput"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`custom-input ${errors.description ? 'error-input' : ''}`}
              rows="5"
              style={{ overflowY: 'scroll', resize: 'none' }}
            />
            {errors.description && (
              <span className="error-text">
                <FontAwesomeIcon icon={faExclamationCircle} /> {errors.description}
              </span>
            )}
          </div>

          <div className="custom-form-group">
            <label htmlFor="categoryInput" className="custom-label">
              Category:
            </label>
            <select
              id="categoryInput"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`custom-input ${errors.category ? 'error-input' : ''}`}
            >
              <option value="">Select a category</option>
              <option value='Anti-biotic'>Anti-biotic</option>
              <option value='Anti-septics'>Anti-septics</option>
              <option value='Anti-diabetic'>Anti-diabetic</option>
              <option value='Pain Killer'>Pain Killer</option>
              <option value='Homeopaethic'>Homeopaethic</option>
              <option value='Cardiovascular'>Cardiovascular</option>
              <option value='Sedatives'>Sedatives</option>
              <option value='Laxatives'>Laxatives</option>
              <option value='Vaccines'>Vaccines</option>
              <option value='Other'>Other</option>
            </select>
            {errors.category && (
              <span className="error-text">
                <FontAwesomeIcon icon={faExclamationCircle} /> {errors.category}
              </span>
            )}
          </div>

          <div className="custom-form-group">
            <label htmlFor="priceInput" className="custom-label">
              Price:
            </label>
            <input
              type="number"
              id="priceInput"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`custom-input ${errors.price ? 'error-input' : ''}`}
            />
            {errors.price && (
              <span className="error-text">
                <FontAwesomeIcon icon={faExclamationCircle} /> {errors.price}
              </span>
            )}
          </div>

          <div className="custom-form-group">
            <label htmlFor="photoInput" className="custom-label">
              Upload Photo:
            </label>
            <input
              type="file"
              id="photoInput"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="custom-input"
            />
            {photoPreview && <img src={photoPreview} alt="Preview" className="photo-preview" />}
            {errors.photo && (
              <span className="error-text">
                <FontAwesomeIcon icon={faExclamationCircle} /> {errors.photo}
              </span>
            )}
          </div>

          <div className="custom-form-group optional-section">
            <label htmlFor="bulkInput" className="custom-label optional-label">
              Bulk Import (Optional):
            </label>
            <input
              type="file"
              id="bulkInput"
              name="bulkFile"
              accept=".csv"
              onChange={handleBulkFileChange}
              className="custom-input optional-input"
            />
            <button
              type="button"
              className="custom-submit-button optional-button"
              onClick={handleBulkImport}
            >
              <FontAwesomeIcon icon={faUpload} /> Bulk Import
            </button>
          </div>

          <div className="button-container">
            <button type="submit" className="custom-submit-button">
              <FontAwesomeIcon icon={faCheckCircle} /> Add Medicine
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddMedicineForm;
