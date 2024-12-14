import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  useDeleteVehicle,
  useGetAllVehicles,
} from "../services/api/verhcleApi";
import Loading from "../loading";

function VehicleTable({  onEdit }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { data: vehiclesData, refetch } = useGetAllVehicles();
  const { mutateAsync: deleteVehicle, isPending } = useDeleteVehicle();

  console.log("fetched data", vehiclesData);

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedVehicle) {
      onDelete(selectedVehicle._id);
      console.warn("deleted",selectedVehicle._id);
      await deleteVehicle(selectedVehicle._id);
      setShowModal(false);
      setSelectedVehicle(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedVehicle(null);
  };

  return (
    <div className='container mx-auto p-6'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <table className='w-full table-auto'>
          <thead>
            <tr>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                Vehicle Name
              </th>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                Brand
              </th>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                Model
              </th>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                Year
              </th>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                License Plate
              </th>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                Color
              </th>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                Status
              </th>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                Category
              </th>
              <th className='px-4 py-3 text-left text-white bg-primary uppercase font-bold'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vehiclesData?.map((vehicle) => (
              <tr
                key={vehicle.id}
                className='odd:bg-gray-50 even:bg-primary/10 text-slate-700'
              >
                <td className='px-4 py-3'>{vehicle.name}</td>
                <td className='px-4 py-3'>{vehicle.brand}</td>
                <td className='px-4 py-3'>{vehicle.model}</td>
                <td className='px-4 py-3'>{vehicle.year}</td>
                <td className='px-4 py-3'>{vehicle.licensePlate}</td>
                <td className='px-4 py-3'>{vehicle.color}</td>
                <td className='px-4 py-3'>
                  <span
                    className={`inline-block px-3 py-0 rounded-full text-sm font-normal ${
                      vehicle.status.toLowerCase() === "active"
                        ? "bg-primary text-white"
                        : vehicle.status.toLowerCase() === "maintenance"
                        ? "bg-yellow-400 text-yellow-800"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </td>
                <td className='px-4 py-3'>{vehicle.category}</td>
                <td className='px-4 py-3'>

                  <button
                    onClick={() => {
                      // onEdit(vehicle);
                      navigate("/edit", { state: { initialData  :vehicle } });
                    }}
                    className='text-primary hover:text-secondary mr-3 text-xl'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(vehicle)}
                    className='text-red-600 hover:text-red-700 text-xl'
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-gray-500 bg-opacity-50 text-primary flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
            <h2 className='text-xl font-semibold text-center mb-4'>
              Confirm Delete
            </h2>
            <p className='mb-4'>
              Are you sure you want to delete this vehicle?
            </p>
            <p className='mb-6 font-bold'>{selectedVehicle?.name}</p>
            <div className='flex justify-between'>
              <button
                onClick={handleCancelDelete}
                className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isPending && <Loading />}
    </div>
  );
}

export default VehicleTable;
