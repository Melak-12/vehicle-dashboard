import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import VehicleTable from "./components/VehicleTable";
import VehicleForm from "./components/VehicleForm";
import { FaPlus } from "react-icons/fa";

const initialVehicles = [
  {
    id: 1,
    name: "Truck 001",
    brand: "Ford",
    model: "F-150",
    year: 2021,
    licensePlate: "ABC1234",
    color: "Red",
    status: "Active",
    category: "5f84f48b3b1f50d5d2e4a619", // Example category ID (mongoose ObjectId)
    lastUpdated: "2023-05-15 09:30 AM",
  },
  {
    id: 2,
    name: "Van 002",
    brand: "Toyota",
    model: "Sienna",
    year: 2019,
    licensePlate: "XYZ5678",
    color: "Blue",
    status: "Maintenance",
    category: "5f84f48b3b1f50d5d2e4a620", // Example category ID (mongoose ObjectId)
    lastUpdated: "2023-05-14 02:15 PM",
  },
  {
    id: 3,
    name: "Car 003",
    brand: "Honda",
    model: "Civic",
    year: 2018,
    licensePlate: "LMN9876",
    color: "Black",
    status: "Inactive",
    category: "5f84f48b3b1f50d5d2e4a621", // Example category ID (mongoose ObjectId)
    lastUpdated: "2023-05-13 11:45 AM",
  },
  {
    id: 4,
    name: "Truck 004",
    brand: "Chevrolet",
    model: "Silverado",
    year: 2022,
    licensePlate: "GHI3456",
    color: "White",
    status: "Active",
    category: "5f84f48b3b1f50d5d2e4a622", // Example category ID (mongoose ObjectId)
    lastUpdated: "2023-05-15 10:00 AM",
  },
  {
    id: 5,
    name: "Van 005",
    brand: "Mercedes",
    model: "Metris",
    year: 2020,
    licensePlate: "DEF6789",
    color: "Gray",
    status: "Active",
    category: "5f84f48b3b1f50d5d2e4a623", // Example category ID (mongoose ObjectId)
    lastUpdated: "2023-05-15 08:45 AM",
  },
];


function App() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const addVehicle = (newVehicle) => {
    setVehicles([
      ...vehicles,
      {
        ...newVehicle,
        id: Date.now(),
        lastUpdated: new Date().toLocaleString(),
      },
    ]);
  };

  const updateVehicle = (updatedVehicle) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === updatedVehicle.id
          ? { ...updatedVehicle, lastUpdated: new Date().toLocaleString() }
          : vehicle
      )
    );
    setEditingVehicle(null);
  };

  const deleteVehicle = (id) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  return (
    <Router>
      <div className='font-sans bg-blue-50 min-h-screen'>
        <Header />
        <Routes>
          <Route
            path='/'
            element={
              <>
                <button
                  onClick={() => (window.location.href = "/add")}
                  className='bg-primary text-white px-6 py-2 mb-5 mt-10 rounded-md flex justify-center items-center gap-2 hover:bg-primary/80 ml-auto mr-10'
                >
                  <FaPlus /> Add Vehicle
                </button>

                <VehicleTable
                  vehicles={vehicles}
                  onEdit={setEditingVehicle}
                  onDelete={deleteVehicle}
                />
              </>
            }
          />
          <Route
            path='/add'
            element={<VehicleForm onSubmit={addVehicle} initialData={null} />}
          />
          <Route
            path='/edit'
            element={
              <VehicleForm
                onSubmit={updateVehicle}
                initialData={editingVehicle}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
