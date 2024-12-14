import express from 'express';
import { 
  addCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController';

const router = express.Router();

router.post('/', addCategory); // Add a new category
router.get('/', getCategories); // Fetch all categories
router.get('/:id', getCategoryById); // Fetch a single category by ID
router.patch('/:id', updateCategory); // Update a category
router.delete('/:id', deleteCategory); // Delete a category

export default router;
