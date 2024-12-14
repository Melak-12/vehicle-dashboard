import { useMutation, useQuery } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:4000/api/vehicles";

const useGetAllVehicles = () =>
  useQuery({
    queryKey: ["vehicles"],
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

      return response.json();
    },
  });

const useCreateVehicle = () =>
  useMutation({
    mutationKey: ["createVehicle"],
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

      return response.json();
    },
  });

const useUpdateVehicle = () =>
  useMutation({
    mutationKey: ["updateVehicle"],
    mutationFn: async ({ id, ...payload }) => {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Updating vehicle failed");
      }

      return response.json();
    },
  });

const useDeleteVehicle = () =>
  useMutation({
    mutationKey: ["deleteVehicle"],
    mutationFn: async (id) => {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Deleting vehicle failed");
      }

      return response;
    },
  });

export {
  useGetAllVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
};
