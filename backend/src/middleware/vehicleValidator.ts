import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

export const validateVehicleInput = async (req: Request, res: Response, next: NextFunction) => {
  const { category, images } = req.body;

  if (category) {
    const categoryRecord = await Category.findById(category);
    if (!categoryRecord) {
      return res.status(400).json({ message: 'Invalid category' });
    }
  }

  if (!images || images.length === 0) {
    return res.status(400).json({ error: 'No images provided' });
  }

  next();
};

export const validateStatusUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const validStatuses = ['available', 'sold', 'pending'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Allowed values are: available, sold, pending.' });
  }

  next();
};

