import React, { useState, useEffect } from 'react';

function VehicleUpdateModal({ show, onClose, onSubmit, vehicle, isUpdating }) {
  const [formData, setFormData] = useState(vehicle || {});

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Vehicle</h2>
        <form onSubmit={handleSubmit}>
          {Object.entries(formData).map(([key, value]) => {
            if (key === '_id' || key === '__v' || key === 'images' || key==="status" || key==='lastUpdated') return null;
            return (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  id={key}
                  name={key}
                  type="text"
                  value={value}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            );
          })}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleUpdateModal;

