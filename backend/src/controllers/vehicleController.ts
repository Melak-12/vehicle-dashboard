import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload';

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
      category, 
    } = req.body;

    const uploadedImageUrls: string[] = [];
    for (const base64Image of images) {
      if (base64Image) {
        const imageUrl = await uploadImageToCloudinary(base64Image);
        if (imageUrl) {
          uploadedImageUrls.push(imageUrl);
        }
      }
    }

    const newVehicle = new Vehicle({
      name, 
      brand, 
      model, 
      year, 
      licensePlate, 
      color, 
      images: uploadedImageUrls, 
      status, 
      category, 
    });

    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error adding vehicle', error: errorMessage });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { category, images, ...updateData } = req.body;

    const uploadedImageUrls: string[] = [];
    if (images && images.length > 0) {
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

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { ...updateData, lastUpdated: new Date() },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(updatedVehicle);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error updating vehicle', error: errorMessage });
  }
};

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find().populate('category', 'name');
    res.json(vehicles);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error fetching vehicles', error: errorMessage });
  }
};

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
    console.error('Error updating vehicle status:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error updating vehicle status', error: errorMessage });
  }
};

export const deleteVehicleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error deleting vehicle', error: errorMessage });
  }
};

