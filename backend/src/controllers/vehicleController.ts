import { Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import Category from '../models/Category';
import cloudinary from '../config/cloudinary';


const uploadImageToCloudinary = async (base64Image: string) => {
  const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');

  try {
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Data}`, {
      folder: 'vehicle',
      quality: 'auto:low', 
      format: 'jpg', 
    });

    return result.secure_url; 
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null; 
  }
};


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
    

    const categoryRecord = await Category.findById(category);
    if (!categoryRecord) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const uploadedImageUrls: string[] = [];
    for (const base64Image of images) {
      if (base64Image) {
        console.log("firstImage");
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

    if (category) {
      const categoryRecord = await Category.findById(category);
      if (!categoryRecord) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    // Upload new images to Cloudinary if provided
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
      updateData.images = uploadedImageUrls; // Update images if they were uploaded
    }

    // Update the vehicle in the database
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

// Fetch all vehicles
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find().populate('category', 'name');
    res.json(vehicles);
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(400).json({ message: 'Error fetching vehicles', error: errorMessage });
  }
};

// Fetch a single vehicle by ID
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



// Update vehicle status
export const updateVehicleStatus = async (req: Request, res: Response) => {
  const { status } = req.body;  // Get the new status from request body
  const { id } = req.params;  // Get the vehicle ID from the URL parameters

  try {
    // Validate status value
    const validStatuses = ['available', 'sold', 'pending'];  // Define valid statuses
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value. Allowed values are: available, sold, pending.' });
    }

    // Find the vehicle by ID
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    // Update the vehicle's status
    vehicle.status = status;
    vehicle.lastUpdated = new Date();  // Optionally update the lastUpdated field

    // Save the updated vehicle to the database
    const updatedVehicle = await vehicle.save();

    // Send the updated vehicle as response
    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle status:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    res.status(500).json({ message: 'Error updating vehicle status', error: errorMessage });
  }
};

