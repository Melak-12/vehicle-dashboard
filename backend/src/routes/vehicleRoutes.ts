import express from 'express';
import multer from 'multer';
import {
  addVehicle,
  updateVehicle,
  getVehicles,
  getVehicleById,
  updateVehicleStatus,deleteVehicle
} from '../controllers/vehicleController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.array('images', 5), addVehicle);
router.patch('/:id', upload.array('images', 5), updateVehicle);
router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.patch('/:id/status', updateVehicleStatus);
router.delete('/:id', deleteVehicle)


export default router;
