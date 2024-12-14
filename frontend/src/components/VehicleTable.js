import React, { useState } from "react";
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useDeleteVehicle,
  useGetAllVehicles,
  useUpdateVehicle,
  useUpdateVehicleStatus,
} from "../services/api/verhcleApi.js";
import Loading from "../loading";

function VehicleTable() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedVehicleData, setUpdatedVehicleData] = useState(null);
  const [newStatus, setNewStatus] = useState(""); 

  // Fetching vehicle data and related hooks
  const { data: vehiclesData, isLoading, isError, refetch } = useGetAllVehicles();
  const { mutateAsync: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();
  const { mutateAsync: updateVehicle, isPending: isUpdating } = useUpdateVehicle();
  const { mutateAsync: updateVehicleStatus, isPending: isStatusUpdating } = useUpdateVehicleStatus(); 

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedVehicle) {
      await deleteVehicle(selectedVehicle._id);
      setShowModal(false);
      setSelectedVehicle(null);
      refetch();  // Refetch data after delete
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleEditClick = (vehicle) => {
    setUpdatedVehicleData(vehicle);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVehicle(updatedVehicleData); // Call API to update vehicle
      setShowUpdateModal(false); // Close the modal after success
      refetch(); // Refetch data after update
    } catch (error) {
      console.error("Error updating vehicle", error);
    }
  };

  const handleStatusUpdate = async (vehicleId, status) => {
    try {
      await updateVehicleStatus({ vehicleId, status });
      refetch();  // Refetch data after status update
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-600">Error loading vehicles</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Image</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Vehicle Name</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Brand</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Model</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Year</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">License Plate</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Color</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Status</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Category</th>
              <th className="px-4 py-3 text-left text-white bg-primary uppercase font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehiclesData?.map((vehicle) => (
              <tr key={vehicle._id} className="odd:bg-gray-50 even:bg-primary/10 text-slate-700">
                <td className="px-4 py-3">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <button
                      onClick={() => handleImageClick(vehicle.images[0])}
                      className="text-primary hover:text-secondary"
                      aria-label={`View image of ${vehicle.name}`}
                    >
                      <FaImage size={24} />
                    </button>
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="px-4 py-3">{vehicle.name}</td>
                <td className="px-4 py-3">{vehicle.brand}</td>
                <td className="px-4 py-3">{vehicle.model}</td>
                <td className="px-4 py-3">{vehicle.year}</td>
                <td className="px-4 py-3">{vehicle.licensePlate}</td>
                <td className="px-4 py-3">{vehicle.color}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-normal ${
                      vehicle.status.toLowerCase() === "active"
                        ? "bg-primary text-white"
                        : vehicle.status.toLowerCase() === "maintenance"
                        ? "bg-yellow-400 text-yellow-800"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                  <button
                    onClick={() => handleStatusUpdate(vehicle._id, "sold")}
                    className="ml-2 text-yellow-500 hover:text-yellow-600"
                    aria-label={`Set ${vehicle.name} to maintenance`}
                  >
                    Set to Sold
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(vehicle._id, "available")}
                    className="ml-2 text-green-500 hover:text-green-600"
                    aria-label={`Set ${vehicle.name} to active`}
                  >
                    Set to Available
                  </button>
                </td>
                <td className="px-4 py-3">{vehicle.category}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleEditClick(vehicle)}
                    className="text-primary hover:text-secondary mr-3 text-xl"
                    aria-label={`Edit ${vehicle.name}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(vehicle)}
                    className="text-red-600 hover:text-red-700 text-xl"
                    aria-label={`Delete ${vehicle.name}`}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Vehicle Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center mb-4">Update Vehicle</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="name">Vehicle Name</label>
                <input
                  id="name"
                  type="text"
                  value={updatedVehicleData?.name || ""}
                  onChange={(e) => setUpdatedVehicleData({ ...updatedVehicleData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {/* Add more fields as needed */}
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="model">Model</label>
                <input
                  id="model"
                  type="text"
                  value={updatedVehicleData?.model || ""}
                  onChange={(e) => setUpdatedVehicleData({ ...updatedVehicleData, model: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleCloseUpdateModal}
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
            <img src={selectedImage} alt="Vehicle" className="w-full h-auto" />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full p-2"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this vehicle?</p>
            <div className="flex justify-between">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleTable;
