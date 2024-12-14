import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaImage, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useDeleteVehicle,
  useGetAllVehicles,
  useUpdateVehicle,
  useUpdateVehicleStatus,
} from "../services/api/verhcleApi.js";
import Loading from "../loading.js";
import StatusBadge from "../components/statusBadge.js";
import VehicleUpdateModal from "../components/vehicleUpdate";
import ImageModal from "../components/imageModal.js";
import ConfirmModal from "../components/confirmModal.js";

function VehicleTable() {
  const navigate = useNavigate();

  // State management
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedVehicleData, setUpdatedVehicleData] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetching vehicle data and related hooks
  const { data: vehiclesData, isLoading, isError, refetch } = useGetAllVehicles();
  const { mutateAsync: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();
  const { mutateAsync: updateVehicle, isPending: isUpdating } = useUpdateVehicle();
  const { mutateAsync: updateVehicleStatus, isPending: isStatusUpdating } = useUpdateVehicleStatus();

  // Filtered vehicle list
  const filteredVehicles = vehiclesData?.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicles?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil((filteredVehicles?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedVehicle) {
      await deleteVehicle(selectedVehicle._id);
      setShowDeleteModal(false);
      setSelectedVehicle(null);
      refetch();
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleEditClick = (vehicle) => {
    setUpdatedVehicleData(vehicle);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      await updateVehicle(updatedData);
      setShowUpdateModal(false);
      refetch();
    } catch (error) {
      console.error("Error updating vehicle", error);
    }
  };

  const handleStatusUpdate = async (vehicleId, newStatus) => {
    setStatusUpdating(vehicleId);
    try {
      await updateVehicleStatus({ vehicleId, status: newStatus });
      refetch();
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setStatusUpdating(null);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-600">Error loading vehicles</div>;

  return (
    <div className="container mx-auto p-6 bg-gradient-to-b from-purple-100 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-purple-800 mb-6">Vehicle Management</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-purple-700">
            Total Vehicles: <span className="text-purple-900">{filteredVehicles?.length || 0}</span>
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto h-[calc(100vh-300px)]">
          <table className="w-full table-auto min-w-[1000px]">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <th className="px-4 py-3 text-left font-bold">Image</th>
                <th className="px-4 py-3 text-left font-bold">Vehicle Name</th>
                <th className="px-4 py-3 text-left font-bold">Brand</th>
                <th className="px-4 py-3 text-left font-bold">Model</th>
                <th className="px-4 py-3 text-left font-bold">Year</th>
                <th className="px-4 py-3 text-left font-bold">License Plate</th>
                <th className="px-4 py-3 text-left font-bold">Color</th>
                <th className="px-4 py-3 text-left font-bold">Status</th>
                <th className="px-4 py-3 text-left font-bold">Category</th>
                <th className="px-4 py-3 text-left font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((vehicle) => (
                <tr key={vehicle._id} className="border-b border-purple-200 hover:bg-purple-50">
                  <td className="px-4 py-3">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <button
                        onClick={() => handleImageClick(vehicle.images[0])}
                        className="text-purple-600 hover:text-purple-800 transition-colors duration-200"
                        aria-label={`View image of ${vehicle.name}`}
                      >
                        <FaImage size={24} />
                      </button>
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{vehicle.name}</td>
                  <td className="px-4 py-3">{vehicle.brand}</td>
                  <td className="px-4 py-3">{vehicle.model}</td>
                  <td className="px-4 py-3">{vehicle.year}</td>
                  <td className="px-4 py-3">{vehicle.licensePlate}</td>
                  <td className="px-4 py-3">{vehicle.color}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={vehicle.status}
                      isUpdating={statusUpdating === vehicle._id}
                      onUpdate={(newStatus) => handleStatusUpdate(vehicle._id, newStatus)}
                    />
                  </td>
                  <td className="px-4 py-3">{vehicle.category}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEditClick(vehicle)}
                      className="text-indigo-600 hover:text-indigo-800 mr-3 transition-colors duration-200"
                      aria-label={`Edit ${vehicle.name}`}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(vehicle)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      aria-label={`Delete ${vehicle.name}`}
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredVehicles?.length || 0)} of {filteredVehicles?.length || 0} entries
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
            >
              <FaChevronLeft />
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => handlePageChange(number + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number + 1
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                }`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
      <VehicleUpdateModal
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={handleUpdateSubmit}
        vehicle={updatedVehicleData}
        isUpdating={isUpdating}
      />

      <ImageModal
        show={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={selectedImage}
      />

      <ConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this vehicle?"
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        confirmColor="red"
      />
    </div>
  );
}

export default VehicleTable;

