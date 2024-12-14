import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaEdit } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../loading";
import { toast } from "react-toastify";
import { useCreateVehicle, useDeleteVehicle, useUpdateVehicle } from "../services/api/verhcleApi";

function VehicleForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state?.initialData || null;

  const { mutateAsync: addVehicle, isPending: isAddPending } =
    useCreateVehicle();
  const { mutateAsync: updateVehicle, isPending: isUpdatePending } =
    useUpdateVehicle();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        name: "",
        brand: "",
        model: "",
        year: "",
        licensePlate: "",
        color: "",
        status: "Active",
        category: "",
      });
    }
  }, [initialData, reset]);

  const submitHandler = async (data) => {
    try {
      if (initialData) {
        // Update vehicle
        console.log(data,"id is",initialData._id);
        await updateVehicle({ id: initialData._id, ...data });
        toast.success("Vehicle updated successfully");
      } else {
        // Add new vehicle
        await addVehicle(data);
        reset({
          name: "",
          brand: "",
          model: "",
          year: "",
          licensePlate: "",
          color: "",
          status: "Active",
          category: "",
        });
        toast.success("Vehicle added successfully");
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save vehicle");
    }
  };

  return (
    <div className='container mx-auto px-4 py-12'>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className='bg-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto'
      >
        <h2 className='text-2xl font-semibold text-center text-primary mb-6'>
          {initialData ? "Edit Vehicle" : "Add Vehicle"}
        </h2>
        <div className='mb-6'>
          <label
            htmlFor='name'
            className='block text-lg font-semibold text-primary mb-2'
          >
            Vehicle Name:
          </label>
          <input
            id='name'
            {...register("name", { required: "Vehicle name is required" })}
            className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
          {errors.name && (
            <span className='text-red-600 text-sm mt-1'>
              {errors.name.message}
            </span>
          )}
        </div>
        <div className='mb-6'>
          <label
            htmlFor='brand'
            className='block text-lg font-semibold text-primary mb-2'
          >
            Brand:
          </label>
          <input
            id='brand'
            {...register("brand", { required: "Brand is required" })}
            className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
          {errors.brand && (
            <span className='text-red-600 text-sm mt-1'>
              {errors.brand.message}
            </span>
          )}
        </div>
        <div className='mb-6'>
          <label
            htmlFor='model'
            className='block text-lg font-semibold text-primary mb-2'
          >
            Model:
          </label>
          <input
            id='model'
            {...register("model", { required: "Model is required" })}
            className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
          {errors.model && (
            <span className='text-red-600 text-sm mt-1'>
              {errors.model.message}
            </span>
          )}
        </div>
        <div className='mb-6'>
          <label
            htmlFor='year'
            className='block text-lg font-semibold text-primary mb-2'
          >
            Year:
          </label>
          <input
            id='year'
            type='number'
            {...register("year", { required: "Year is required" })}
            className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
          {errors.year && (
            <span className='text-red-600 text-sm mt-1'>
              {errors.year.message}
            </span>
          )}
        </div>
        <div className='mb-6'>
          <label
            htmlFor='licensePlate'
            className='block text-lg font-semibold text-primary mb-2'
          >
            License Plate:
          </label>
          <input
            id='licensePlate'
            {...register("licensePlate", {
              required: "License plate is required",
            })}
            className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
          {errors.licensePlate && (
            <span className='text-red-600 text-sm mt-1'>
              {errors.licensePlate.message}
            </span>
          )}
        </div>
        <div className='mb-6'>
          <label
            htmlFor='color'
            className='block text-lg font-semibold text-primary mb-2'
          >
            Color:
          </label>
          <input
            id='color'
            {...register("color", { required: "Color is required" })}
            className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          />
          {errors.color && (
            <span className='text-red-600 text-sm mt-1'>
              {errors.color.message}
            </span>
          )}
        </div>
        <div className='mb-6'>
          <label
            htmlFor='status'
            className='block text-lg font-semibold text-primary mb-2'
          >
            Status:
          </label>
          <select
            id='status'
            {...register("status")}
            className='w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
          >
            <option value='Active'>Active</option>
            <option value='Maintenance'>Maintenance</option>
            <option value='Inactive'>Inactive</option>
          </select>
        </div>
        <button
          type='submit'
          className='w-full bg-primary text-white py-3 rounded-md cursor-pointer flex justify-center items-center gap-2 hover:bg-secondary transition duration-200'
        >
          {initialData ? (
            <>
              <FaEdit /> Update Vehicle
            </>
          ) : (
            <>
              <FaPlus /> Add Vehicle
            </>
          )}
        </button>
      </form>
      {(isAddPending || isUpdatePending) && <Loading />}
    </div>
  );
}

export default VehicleForm;
