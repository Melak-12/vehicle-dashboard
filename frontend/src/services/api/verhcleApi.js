import { useMutation, useQuery } from "@tanstack/react-query";

const API_BASE_URL = "http://192.168.204.15:4000/api/vehicles";

// For fetching all vehicles
const useGetAllVehicles = () =>
  useQuery({
    queryKey: ["vehicles"], // Unique key for this query
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Fetching vehicles failed");
      }

      return response.json(); // Resolves the JSON response
    },
  });

// For creating a vehicle
const useCreateVehicle = () =>
  useMutation({
    mutationKey: ["createVehicle"], // Unique key for this mutation
    mutationFn: async (payload) => {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Creating vehicle failed");
      }

      return response.json(); // Resolves the JSON response
    },
  });

// For deleting a vehicle
const useDeleteVehicle = () =>
  useMutation({
    mutationKey: ["deleteVehicle"], // Unique key for this mutation
    mutationFn: async (payload) => {
      const response = await fetch(`${API_BASE_URL}/vehicles/`, {
        method: "DELETE",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Deleting vehicle failed");
      }

      return response.json(); // Resolves the JSON response
    },
  });

export { useGetAllVehicles, useCreateVehicle, useDeleteVehicle };
