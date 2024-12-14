import { useMutation, useQuery } from "@tanstack/react-query";

// Base URL for the API
const API_BASE_URL = "http://localhost:4000/api/vehicles";

// Fetch all vehicles
const useGetAllVehicles = () =>
  useQuery({
    queryKey: ["vehicles"], // Unique query key
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to fetch vehicles.");
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error fetching vehicles:", error);
    },
  });

// Create a new vehicle
const useCreateVehicle = () =>
  useMutation({
    mutationKey: ["createVehicle"], // Unique mutation key
    mutationFn: async (vehicleData) => {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to create vehicle.");
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error creating vehicle:", error);
    },
  });

// Delete a vehicle by ID
const useDeleteVehicle = () =>
  useMutation({
    mutationKey: ["deleteVehicle"], // Unique mutation key
    mutationFn: async (vehicleId) => {
      const response = await fetch(`${API_BASE_URL}/${vehicleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to delete vehicle.");
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error deleting vehicle:", error);
    },
  });

// Update a vehicle by ID
const useUpdateVehicle = () =>
  useMutation({
    mutationKey: ["updateVehicle"], // Unique mutation key
    mutationFn: async (vehicleData) => {
      const response = await fetch(`${API_BASE_URL}/${vehicleData._id}`, {
        method: "PUT", // Use PUT for updating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to update vehicle.");
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error updating vehicle:", error);
    },
  });

// Update vehicle status by ID
const useUpdateVehicleStatus = () =>
  useMutation({
    mutationKey: ["updateVehicleStatus"], // Unique mutation key
    mutationFn: async ({ vehicleId, status }) => {
      const response = await fetch(`${API_BASE_URL}/${vehicleId}/status`, {
        method: "PUT", // Use PUT for updating status
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.message || "Failed to update vehicle status.");
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Error updating vehicle status:", error);
    },
  });

export { useGetAllVehicles, useCreateVehicle, useDeleteVehicle, useUpdateVehicle, useUpdateVehicleStatus };
