import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VehicleForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    color: '',
    status: 'available',
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });

    try {
      const images = await Promise.all(imagePromises);
      setFormData(prevData => ({
        ...prevData,
        images
      }));
    } catch (error) {
      console.error('Error processing images:', error);
      setError('Error processing images. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add vehicle');
      }

      const result = await response.json();
      console.log('Vehicle added successfully:', result);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-primary mb-6">Add Vehicle</h2>
        
        <div className="mb-6">
          <label htmlFor="name" className="block text-lg font-semibold text-primary mb-2">Vehicle Name:</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="brand" className="block text-lg font-semibold text-primary mb-2">Brand:</label>
          <input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="model" className="block text-lg font-semibold text-primary mb-2">Model:</label>
          <input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="year" className="block text-lg font-semibold text-primary mb-2">Year:</label>
          <input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="licensePlate" className="block text-lg font-semibold text-primary mb-2">License Plate:</label>
          <input
            id="licensePlate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="color" className="block text-lg font-semibold text-primary mb-2">Color:</label>
          <input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="status" className="block text-lg font-semibold text-primary mb-2">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="images" className="block text-lg font-semibold text-primary mb-2">Images:</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 rounded-md cursor-pointer flex justify-center items-center gap-2 hover:bg-secondary transition duration-200"
        >
          {isLoading ? 'Adding Vehicle...' : 'Add Vehicle'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </div>
  );
}

export default VehicleForm;

