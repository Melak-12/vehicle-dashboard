import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

// Add a new vehicle
export const addVehicle = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      brand, 
      model, 
      year, 
      licensePlate, 
      color, 
      images, 
      status, 
    } = req.body;

    // Process and upload images to Cloudinary
    const uploadedImageUrls: string[] = [];
    for (const base64Image of images) {
      if (base64Image) {
        const imageUrl = await uploadImageToCloudinary(base64Image);
        if (imageUrl) {
          uploadedImageUrls.push(imageUrl);
        }
      }
    }

    // Create a new vehicle
    const newVehicle = new Vehicle({
      name, 
      brand, 
      model, 
      year, 
      licensePlate, 
      color, 
      images: uploadedImageUrls, 
      status, 
    });

    // Save the vehicle to the database
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error adding vehicle:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error adding vehicle', error: errorMessage });
  }
};

// Update an existing vehicle
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      brand, 
      model, 
      year, 
      licensePlate, 
      color, 
      images, 
      status 
    } = req.body;

    let updateData: any = {};

    // Update fields only if they are provided in the request body
    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if (model) updateData.model = model;
    if (year) updateData.year = year;
    if (licensePlate) updateData.licensePlate = licensePlate;
    if (color) updateData.color = color;
    if (status) updateData.status = status;

    // If new images are provided, upload them to Cloudinary
    if (images && images.length > 0) {
      const uploadedImageUrls: string[] = [];
      for (const base64Image of images) {
        if (base64Image) {
          const imageUrl = await uploadImageToCloudinary(base64Image);
          if (imageUrl) {
            uploadedImageUrls.push(imageUrl);
          }
        }
      }
      updateData.images = uploadedImageUrls;
    }

    // Find and update the vehicle by ID
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id, 
      { ...updateData, lastUpdated: new Date() }, 
      { new: true }
    );

    // If no vehicle is found, return a 404 response
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Return the updated vehicle
    res.json(updatedVehicle);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error updating vehicle', error: errorMessage });
  }
};

// Get all vehicles
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error fetching vehicles', error: errorMessage });
  }
};

// Get a specific vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('category', 'name');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error fetching vehicle', error: errorMessage });
  }
};

// Update the status of a vehicle
export const updateVehicleStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    vehicle.status = status;
    vehicle.lastUpdated = new Date();

    const updatedVehicle = await vehicle.save();

    res.status(200).json(updatedVehicle);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error updating vehicle status', error: errorMessage });
  }
};

// Delete a vehicle by ID
export const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error deleting vehicle', error: errorMessage });
  }
};
